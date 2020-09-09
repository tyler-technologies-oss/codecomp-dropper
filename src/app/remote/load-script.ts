export async function loadRemoteScript<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const code = await res.text();
  const module = await import(/* webpackIgnore: true */ `data:text/javascript;charset=utf-8,${code}`);
  return (module.default || module) as T;
}
