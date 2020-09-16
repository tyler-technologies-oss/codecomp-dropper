import { GameObjects, Scene, Types, Animations, Math } from 'phaser';
import { ILocation, IVisitor } from './interfaces';
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
  MovingNorth         = 'moving_north',
  MovingSouth         = 'moving_south',
  MovingEast          = 'moving_east',
  MovingWest          = 'moving_west',
  WaitingInstruction  = 'waiting_instruction',
  Dead                = 'dead'
}

export enum MoveDirection {
  North = 'north',
  South = 'south',
  East = 'east',
  West = 'west',
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
  anims.create({key: `${monster}_${MonsterAnim.Die}`,    frames: animFrameMap[MonsterAnim.Die],    frameRate: 15});
  anims.create({key: `${monster}_${MonsterAnim.Idle}`,   frames: animFrameMap[MonsterAnim.Idle],   frameRate: 12, repeat: -1});
  anims.create({key: `${monster}_${MonsterAnim.Jump}`,   frames: animFrameMap[MonsterAnim.Jump],   frameRate: 15, repeat: -1});
  anims.create({key: `${monster}_${MonsterAnim.Run}`,    frames: animFrameMap[MonsterAnim.Run],    frameRate: 15, repeat: -1});
  anims.create({key: `${monster}_${MonsterAnim.Walk}`,   frames: animFrameMap[MonsterAnim.Walk],   frameRate: 15, repeat: -1});
}

export function createAllMonsterAnimFrames(anims: Animations.AnimationManager) {
  Object.values(MonsterType).forEach(monster => createMonsterAnimFrames(anims, monster));
}

export class Monster extends GameObjects.Sprite implements IVisitor {
  private lastLocation: ILocation;
  private nextLocation: ILocation | null = null;
  private moveTime = 0;
  private maxMoveTime = 2000;
  private idleTime = 0;
  private maxIdleTime = 2000;

  constructor(scene: Scene, x: number, y: number, public readonly type: MonsterType) {
    super(scene, x, y, MonstersAtlas, `${type}/idle/Idle_000.png`);
    scene.add.existing(this);
    this.scale = 0.25;
  }

  play(key: MonsterAnim, ignoreIfPlaying?: boolean, startFrame?: integer): this {
    return super.play(`${this.type}_${key}`, ignoreIfPlaying, startFrame);
  };

  update(time: number, dt: number): void {

    //hacky route, find out how to destroy objects but also remove from update group
    if(this.state === MonsterState.Dead){
      return;
    }

    if (this.state === MonsterState.WaitingInstruction) {
      this.idleTime += dt;

      // check to see if we have idled long enough, then pick a direction to move
      if(this.idleTime >= this.maxIdleTime) {

        // get possible moves
        const locationOptions: MoveDirection[] = Object.entries(this.lastLocation.neighbor).reduce(
          (opts: MoveDirection[], kvp: [MoveDirection, ILocation]) => {
            const [direction, location] = kvp;
            if (location) {
              opts.push(direction);
            }
            return opts;
          },
        []);

        // pick a move option
        const direction = locationOptions[Math.Between(0, locationOptions.length - 1)];

        // move!
        this.move(direction);
      }
    } else {
      this.moveTime += dt;

      if (this.moveTime >= this.maxMoveTime) {
        this.moveTime = this.maxMoveTime;
      }

      const t = this.moveTime / this.maxMoveTime;
      const [lx, ly] = this.lastLocation.getPosition();
      const [nx, ny] = this.nextLocation.getPosition();
      this.x = Math.Interpolation.Linear([lx, nx], t);
      this.y = Math.Interpolation.Linear([ly, ny], t);

      if (this.moveTime === this.maxMoveTime) {
        this.nextLocation.acceptVisitor(this);
        this.lastLocation.exitVisitor(this);
        this.lastLocation = this.nextLocation;
        if(this.state !== MonsterState.Dead){
          this.idle();
        }
      }
    }
  }

  setLocation(location: ILocation) {
    this.lastLocation = location;

    const [x, y] = location.getPosition();
    this.setPosition(x, y);

    this.idle();
  }

  idle() {
    this.state = MonsterState.WaitingInstruction;
    this.play(MonsterAnim.Idle, false, Math.Between(0, 11));
    this.idleTime = 0;
    this.nextLocation = null;
  }

  move(direction: MoveDirection) {
    this.nextLocation = this.lastLocation.neighbor[direction];
    switch(direction) {
      case MoveDirection.North: this.state = MonsterState.MovingNorth; break;
      case MoveDirection.South: this.state = MonsterState.MovingSouth; break;
      case MoveDirection.East:
        this.state = MonsterState.MovingEast;
        this.flipX = true;
        break;
      case MoveDirection.West:
        this.state = MonsterState.MovingWest;
        this.flipX = false;
        break;
    }
    this.moveTime = 0;
    this.play(MonsterAnim.Run);
  }

  die(location: ILocation) {
    console.log("Die called for " + this.type);
    this.state = MonsterState.Dead;
    this.play(MonsterAnim.Die);
    location.exitVisitor(this);
  }
}
