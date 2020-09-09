import { Types, AUTO } from 'phaser';

export type GameConfig = Types.Core.GameConfig;

export const defaultConfig: GameConfig = {
  type: AUTO,
  height: 600,
  width: 800,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 100 }
    }
  }
}
