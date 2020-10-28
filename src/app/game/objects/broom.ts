import { Animations, Scene, Types } from 'phaser';

export const BroomAtlas = 'broom';
const assetPath = 'assets/sprites';

export function loadBroomAssets(scene: Scene) {
  scene.load.multiatlas(BroomAtlas, `${assetPath}/broom.json`, assetPath);
}


export function createBroomAnimFrames(anims: Animations.AnimationManager) {
  const start = 0;
  const zeroPad = 1;
  const suffix = '.png';
  const animFrameMap: Record<string, Types.Animations.AnimationFrame[]> = {
    ['broom-sweep']: anims.generateFrameNames(BroomAtlas, { prefix: `broom-`, end: 4, start, zeroPad, suffix}),
  };

  anims.create({ key: `broom_sweep`, frames: animFrameMap['broom-sweep'], frameRate:3});
}

