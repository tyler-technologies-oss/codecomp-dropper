import { Game, Core } from 'phaser';
import { GameConfig, defaultConfig } from './config';
import { MainScene } from './scenes/main.scene';

export { Game } from 'phaser';
export { GameConfig } from './config';

export const GameEvent = Core.Events;

export function createGame(config: GameConfig) {
  const game = new Game({...defaultConfig, scene: [MainScene], ...config});
  return game;
}
