import { Scene } from 'phaser';
import { squareGrid } from '../objects/grid';

import { loadMonsterAssets, createAllMonsterAnimFrames } from '../objects/monster'
import { MatchEventArgs, MatchEvent } from '../objects/interfaces';

import { GameManager } from '../objects/game-manager';
import { loadBackgroundAssets, Background } from '../objects/background';
import { loadTileAssets } from '../objects/tile';
import { createAllGameEndAnimFrames, GameEnd, loadGameEndAssets } from '../objects/game-over';

export const MainKey = 'main';

export class MainScene extends Scene {
  match: GameManager;
  background: Background;
  gameEnd: GameEnd;

  constructor() {
    super({ key: MainKey });
    this.match = new GameManager();
  }

  create() {
    // initialize all the animations
    createAllMonsterAnimFrames(this.anims);
    createAllGameEndAnimFrames(this.anims);
    this.background = new Background(this);
    this.gameEnd = new GameEnd();
    this.match.on(MatchEvent.GameEnd, this.gameOverEvent, this);
    const grid = squareGrid(this, this.scale, 5);
    this.match.initGrid(grid);
  }

  preload() {
    loadBackgroundAssets(this);
    loadMonsterAssets(this);
    loadTileAssets(this);
    loadGameEndAssets(this);
  }

  update(time: number, dt: number) {
    this.background.update(dt); 
    this.gameEnd.update(dt);
  }

  gameOverEvent(args: MatchEventArgs) {
    const winningSide = args.state === 'homeTeamWins' ? 'home' : 'away';
    const victoryMonsterType = winningSide === 'home' ? args.team.home.monsterType : args.team.away.monsterType;
    const defeatMonsterType = winningSide === 'home' ? args.team.away.monsterType : args.team.home.monsterType;
    this.match.hide();
    this.gameEnd.init(this, winningSide, victoryMonsterType, defeatMonsterType);
  }
}
