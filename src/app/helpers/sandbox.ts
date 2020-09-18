import { QueryablePromise } from './query-promise';

function createWebWorkerSource(code: string) {
  const workerScript = `
  (async function(){
    const module = await import(\`data:text/javascript;charset=utf-8,${code}\`);
    const untrustedFn = module.default || module;

    onmessage = evt => {
      let input = evt.data[0];
      let result = null;
      (() => {
        var evt = null;
        result = untrustedFn(input);
      })();

      self.postMessage(result);
    }
  })();
  `;

  const blob = new Blob([workerScript], {type: 'application/javascript'});
  return URL.createObjectURL(blob);
}

export interface ISandbox {
  kill(): void;
  evalAsync<T>(data: any, timeout?: number): QueryablePromise<T>;
}

class Sandbox {

  private _worker: Worker = null;
  private get worker() {
    if (this._worker === null) {
      const urlObject = createWebWorkerSource(this.untrustedCode);
      const opts: WorkerOptions = {
        type: 'module'
      }
      this._worker = new Worker(urlObject, opts);

    }

    return this._worker;
  }

  constructor(private untrustedCode: string) {}

  kill() {
    if (this._worker) {
      this._worker.terminate();
      this._worker = null;
    }
  }

  evalAsync<Result>(data: any, timeout = 2000): QueryablePromise<Result> {
    const worker = this.worker;
    return new QueryablePromise((resolve, reject) => {
      const handle = setTimeout(() => {
        this.kill();
        reject(`timeout`);
      }, timeout);

      worker.onmessage = evt => {
        clearTimeout(handle);
        resolve(evt.data);
      };

      worker.onerror = err => {
        clearTimeout(handle);
        reject(err);
      }

      worker.postMessage([data]);
    });
  }
}

export async function createSandboxAsync(src: string): Promise<ISandbox> {
  let isUrl = true;

  try {
    new URL(src);
  } catch (_) {
    isUrl = false;
  }

  let code = src;
  if (isUrl) {
    const res = await fetch(src);
    code = await res.text();
  }

  return new Sandbox(code);
}
