import { GameObjects, Scene, Types, Animations, Math } from 'phaser';
import { ILocation, IVisitor, MoveDirection } from './interfaces';
import { Tile } from './tile';

export const MonstersAtlas = 'monsters';
const assetsPath = 'assets/sprites';

export function loadMonsterAssets(scene: Scene) {
  scene.load.multiatlas(MonstersAtlas, `${assetsPath}/monsters.json`, assetsPath);
}

export enum MonsterType {
  Bobo      = 'bobo',
  Triclops  = 'triclops',
  Goldy     = 'goldy',
  Pinky     = 'pinky',
  Spike     = 'spike',
  Grouchy   = 'grouchy',
}

export enum MonsterAnim {
  Attack  = 'attack',
  Die     = 'die',
  Idle    = 'idle',
  Jump    = 'jump',
  Run     = 'run',
  Walk    = 'walk',
}

export enum MonsterState {
  MovingNorth = 'moving_north',
  MovingSouth = 'moving_south',
  MovingEast  = 'moving_east',
  MovingWest  = 'moving_west',
  Idle        = 'idle',
  Thinking    = 'thinking',
  Dead        = 'dead'
}

export function createMonsterAnimFrames(anims: Animations.AnimationManager, monster: MonsterType) {
  const start = 0;
  const zeroPad = 3;
  const suffix = '.png';
  const animFrameMap: Record<string, Types.Animations.AnimationFrame[]> = {
    [MonsterAnim.Attack]: anims.generateFrameNames(MonstersAtlas, { prefix: `${monster}/attack/Attack_`, end: 7,  start, zeroPad, suffix }),
    [MonsterAnim.Die]:    anims.generateFrameNames(MonstersAtlas, { prefix: `${monster}/die/Die_`,       end: 9,  start, zeroPad, suffix }),
    [MonsterAnim.Idle]:   anims.generateFrameNames(MonstersAtlas, { prefix: `${monster}/idle/Idle_`,     end: 11, start, zeroPad, suffix }),
    [MonsterAnim.Jump]:   anims.generateFrameNames(MonstersAtlas, { prefix: `${monster}/jump/Jump_`,     end: 4,  start, zeroPad, suffix }),
    [MonsterAnim.Run]:    anims.generateFrameNames(MonstersAtlas, { prefix: `${monster}/run/Run_`,       end: 7,  start, zeroPad, suffix }),
    [MonsterAnim.Walk]:   anims.generateFrameNames(MonstersAtlas, { prefix: `${monster}/walk/Walk_`,     end: 11, start, zeroPad, suffix }),
  };

  anims.create({key: `${monster}_${MonsterAnim.Attack}`, frames: animFrameMap[MonsterAnim.Attack], frameRate: 15});
  anims.create({key: `${monster}_${MonsterAnim.Die}`,    frames: animFrameMap[MonsterAnim.Die],    frameRate: 15, hideOnComplete: true});
  anims.create({key: `${monster}_${MonsterAnim.Idle}`,   frames: animFrameMap[MonsterAnim.Idle],   frameRate: 12, repeat: -1});
  anims.create({key: `${monster}_${MonsterAnim.Jump}`,   frames: animFrameMap[MonsterAnim.Jump],   frameRate: 15, });
  anims.create({key: `${monster}_${MonsterAnim.Run}`,    frames: animFrameMap[MonsterAnim.Run],    frameRate: 15, repeat: -1});
  anims.create({key: `${monster}_${MonsterAnim.Walk}`,   frames: animFrameMap[MonsterAnim.Walk],   frameRate: 15, repeat: -1});
}

export function createAllMonsterAnimFrames(anims: Animations.AnimationManager) {
  Object.values(MonsterType).forEach(monster => createMonsterAnimFrames(anims, monster));
}

export class Monster extends GameObjects.Sprite implements IVisitor {
  private lastLocation: ILocation;
  private nextLocation: ILocation | null = null;
  private actionTime = 0;
  private maxActionTime = 2000;

  showLog = false;

  constructor(scene: Scene, x: number, y: number, public readonly type: MonsterType) {
    super(scene, x, y, MonstersAtlas, `${type}/idle/Idle_000.png`);
    scene.add.existing(this);
    this.scale = 0.25;
    this.state = MonsterState.Thinking;
  }

  log(...args) {
    if (this.showLog) {
      console.log(...args);
    }
  }

  play(key: MonsterAnim, ignoreIfPlaying?: boolean, startFrame?: integer): this {
    return super.play(`${this.type}_${key}`, ignoreIfPlaying, startFrame);
  };

  private getNextMove() {
    // get possible moves
    const locationOptions: MoveDirection[] = Object.entries(this.lastLocation.neighbor).reduce(
      (opts: MoveDirection[], kvp: [MoveDirection, ILocation]) => {
        const [direction, location] = kvp;
        if (location) {
          opts.push(direction);
        }
        return opts;
      },
    [MoveDirection.None]);

    // pick a move option
    const direction = locationOptions[Math.Between(0, locationOptions.length - 1)];

    this.log(`[${this.type}] next direction: ${direction}`);

    return direction;
  }

  update(time: number, dt: number): void {
    this.updateState(dt);
  }

  setLocation(location: ILocation) {
    this.lastLocation = location;

    const [x, y] = location.getPosition();
    this.setPosition(x, y);

    this.setState(MonsterState.Thinking);
  }

  die(location: ILocation) {
    this.log("Die called for " + this.type);
    this.setState(MonsterState.Dead);
    location.exitVisitor(this);
  }

  private exitState(state: MonsterState) {
    switch(state) {
      case MonsterState.Dead:
        return;
      case MonsterState.Idle:
      case MonsterState.Thinking:
        this.actionTime = 0;
        return;
      case MonsterState.MovingNorth:
      case MonsterState.MovingSouth:
      case MonsterState.MovingEast:
      case MonsterState.MovingWest:
        this.actionTime = 0;
        this.lastLocation = this.nextLocation;
        this.nextLocation = null;
        break;
      default:
        console.error('unhandled exit state', this.state);
        return;
    }
  }

  private startState(state: MonsterState) {
    if (state === MonsterState.Dead) {
      this.play(MonsterAnim.Die);
      return;
    }

    if (state === MonsterState.Thinking) {
      this.play(MonsterAnim.Idle, false, Math.Between(0, 11));
      return;
    }

    if (state === MonsterState.Idle) {
      // todo: add a little jump animation here, then transition into the idle animation
      this.play(MonsterAnim.Idle, false, Math.Between(0, 11));
      return;
    }

    let moveDirection: MoveDirection;
    switch(state) {
      case MonsterState.MovingNorth:
        moveDirection = MoveDirection.North;
        break;

      case MonsterState.MovingSouth:
        moveDirection = MoveDirection.South;
        break;

      case MonsterState.MovingEast:
        this.flipX = true;
        moveDirection = MoveDirection.East;
        break;

      case MonsterState.MovingWest:
        this.flipX = false;
        moveDirection = MoveDirection.West;
        break;

      // catch any new states that are not explicitly handled
      default:
        console.error('unhandled start state', this.state);
        return;
    }

    this.nextLocation = this.lastLocation.neighbor[moveDirection];
    this.play(MonsterAnim.Run);
  }

  private updateState(dt: number) {
    switch(this.state) {
      case MonsterState.Dead:
        // nothing to update!  we are dead!
        return;

      case MonsterState.Idle:
        this.actionTime += dt;

        if (this.actionTime >= this.maxActionTime) {
          this.setState(MonsterState.Thinking);
        }
        return;

      case MonsterState.Thinking:
        this.actionTime += dt;

        if (this.actionTime >= this.maxActionTime) {
          const direction = this.getNextMove();
          switch(direction) {
            case MoveDirection.North: this.setState(MonsterState.MovingNorth); return;
            case MoveDirection.South: this.setState(MonsterState.MovingSouth); return;
            case MoveDirection.East: this.setState(MonsterState.MovingEast); return;
            case MoveDirection.West: this.setState(MonsterState.MovingWest); return;
            case MoveDirection.None: this.setState(MonsterState.Idle); return;
          }
        }
        return;

      case MonsterState.MovingEast:
      case MonsterState.MovingWest:
      case MonsterState.MovingNorth:
      case MonsterState.MovingSouth:
        this.actionTime += dt;
        const normalizedActionTime = Math.Clamp(this.actionTime / this.maxActionTime, 0, 1);

        const [lx, ly] = this.lastLocation.getPosition();
        const [nx, ny] = this.nextLocation.getPosition();
        this.x = Math.Interpolation.Linear([lx, nx], normalizedActionTime);
        this.y = Math.Interpolation.Linear([ly, ny], normalizedActionTime);

        if (this.actionTime >= this.maxActionTime) {
          this.nextLocation.acceptVisitor(this);
          this.setState(MonsterState.Thinking);
        }
        return;
    }
  }

  // transitionState validates the proposed state transition
  // and if it validates, updates the current state
  // returns true if a state update occurs
  private transitionState(nextState: MonsterState): boolean {
    if (this.state !== MonsterState.Dead) {
      this.state = nextState;
      return true;
    }
    return false;
  }

  setState(state: MonsterState): this {
    // make sure our state actually changed!
    const lastState = this.state as MonsterState;
    if(this.transitionState(state)) {
      this.exitState(lastState);
      this.startState(this.state as MonsterState);
    }
    return this;
  }
}
