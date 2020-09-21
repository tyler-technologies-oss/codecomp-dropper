import { Types, AUTO, Scale } from 'phaser';

export type GameConfig = Types.Core.GameConfig;

export const defaultConfig: GameConfig = {
  type: AUTO,

  scale: {
    mode: Scale.FIT,
    width: '100%',
    height: '100%',
  },

  // physics: {
  //   default: 'arcade',
  //   arcade: {
  //     gravity: { y: 100 }
  //   }
  // }

  banner: false,
  backgroundColor: '#ff00ff', //white for now

  seed: [Math.random().toString()],
}
