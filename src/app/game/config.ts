import { Types, AUTO, Scale } from 'phaser';

export type GameConfig = Types.Core.GameConfig;

export const defaultConfig: GameConfig = {
  type: AUTO,

  scale: {
    mode: Scale.FIT,
    width: 800,
    height: 600,
  },

  // physics: {
  //   default: 'arcade',
  //   arcade: {
  //     gravity: { y: 100 }
  //   }
  // }

  banner: false,
  backgroundColor: '#ffffff', //white for now

  seed: [Math.random().toString()],
}
