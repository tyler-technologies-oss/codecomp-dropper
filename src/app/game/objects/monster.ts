import { GameObjects, Scene, Types, Animations, Math } from 'phaser';

export const MonstersAtlas = 'monsters';
const assetsPath = 'assets/sprites';

export function loadMonsterAssets(scene: Scene) {
  scene.load.multiatlas(MonstersAtlas, `${assetsPath}/monsters.json`, assetsPath);
}

export enum MonsterType {
  Bobo = 'bobo',
  Triclops = 'triclops',
  Goldy = 'goldy',
  Pinky = 'pinky',
  Spike = 'spike',
  Grouchy = 'grouchy',
}

export function createMonsterAnimFrames(anims: Animations.AnimationManager, monster: MonsterType) {
  const start = 0;
  const zeroPad = 3;
  const suffix = '.png';
  const animFrameMap: Record<string, Types.Animations.AnimationFrame[]> = {
    'attack': anims.generateFrameNames(MonstersAtlas, { prefix: `${monster}/attack/Attack_`, end: 7,  start, zeroPad, suffix }),
    'die':    anims.generateFrameNames(MonstersAtlas, { prefix: `${monster}/die/Die_`,       end: 9,  start, zeroPad, suffix }),
    'idle':   anims.generateFrameNames(MonstersAtlas, { prefix: `${monster}/idle/Idle_`,     end: 11, start, zeroPad, suffix }),
    'jump':   anims.generateFrameNames(MonstersAtlas, { prefix: `${monster}/jump/Jump_`,     end: 4,  start, zeroPad, suffix }),
    'run':    anims.generateFrameNames(MonstersAtlas, { prefix: `${monster}/run/Run_`,       end: 7,  start, zeroPad, suffix }),
    'walk':   anims.generateFrameNames(MonstersAtlas, { prefix: `${monster}/walk/Walk_`,     end: 11, start, zeroPad, suffix }),
  };

  anims.create({key: `${monster}_attack`, frames: animFrameMap['attack'], frameRate: 15});
  anims.create({key: `${monster}_die`,    frames: animFrameMap['die'],    frameRate: 15});
  anims.create({key: `${monster}_idle`,   frames: animFrameMap['idle'],   frameRate: 12, repeat: -1});
  anims.create({key: `${monster}_jump`,   frames: animFrameMap['jump'],   frameRate: 15, repeat: -1});
  anims.create({key: `${monster}_run`,    frames: animFrameMap['run'],    frameRate: 15, repeat: -1});
  anims.create({key: `${monster}_walk`,   frames: animFrameMap['walk'],   frameRate: 15, repeat: -1});
}

export function createAllMonsterAnimFrames(anims: Animations.AnimationManager) {
  Object.values(MonsterType).forEach(monster => createMonsterAnimFrames(anims, monster));
}

export class Monster extends GameObjects.Sprite {
  constructor(scene: Scene, x: number, y: number, public readonly type: MonsterType) {
    super(scene, x, y, MonstersAtlas, `${type}/idle/Idle_000.png`);
    this.anims.play(`${this.type}_idle`, false, Math.Between(0, 11));
  }
}

