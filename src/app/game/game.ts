import { Game, Core } from 'phaser';
import { GameConfig, defaultConfig } from './config';
import { MainScene } from './scenes/main.scene';

export { Game } from 'phaser';
export { GameConfig } from './config';

export const GameEvent = Core.Events;

export function createGame(config: GameConfig, mainScene:MainScene) {
  const game = new Game({...defaultConfig, scene: [mainScene], ...config});
  return game;
}
