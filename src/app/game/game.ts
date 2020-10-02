import { Game, Core } from 'phaser';
import { GameConfig, defaultConfig } from './config';
import { ITeamConfig } from './objects/interfaces';
import { MainScene } from './scenes/main.scene';

export { Game } from 'phaser';
export { GameConfig } from './config';

export const GameEvent = Core.Events;

export function createGame(config: GameConfig, homeTeamConfig: ITeamConfig, awayTeamConfig: ITeamConfig) {
  const game = new Game({...defaultConfig, scene: [new MainScene(homeTeamConfig, awayTeamConfig)], ...config});
  return game;
}
