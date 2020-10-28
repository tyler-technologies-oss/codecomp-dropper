import { Scene, Input } from 'phaser';
import { loadMonsterAssets, createAllMonsterAnimFrames } from '../objects/monster'
import { TileGrid } from '../objects/grid';
import { GameOverEventArgs, ITeamConfig, MonsterType, Side, StateChangeEvent, TileState } from '../objects/interfaces';
import { Team } from '../objects/team';
import {
  tileStatusScript,
  idleScript,
  idleErrorScript,
  wanderScript,
  northScript,
  southScript,
  eastScript,
  westScript,
} from '../ai';
import { GameManager, IMatchConfig } from '../objects/game-manager';
import { loadBackgroundAssets, Background } from '../objects/background';
import { loadTileAssets } from '../objects/tile';


export const MainKey = 'main';

export class MainScene extends Scene {
  match: GameManager;
  background: Background;

  constructor() {
    super({ key: MainKey });
    this.match = new GameManager();
  }

  create() {
    // initialize all the animations
    createAllMonsterAnimFrames(this.anims);
    this.background = new Background(this);

    const gridSize = 10;
    const cellSize = this.scale.height / (gridSize + 2);
    const gridHeight = cellSize * gridSize;
    const gridWidth = cellSize * gridSize;
    const gridY = cellSize;
    const gridX = (this.scale.width - gridWidth) / 2;
    const grid = new TileGrid(this, gridX, gridY, gridWidth, gridHeight, gridSize);

    this.match.initGrid(grid);
  }

  preload() {
    loadBackgroundAssets(this);
    loadMonsterAssets(this);
    loadTileAssets(this);
  }

  update(time: number, dt: number) {
    this.background.update(dt)
  }

  showGameOverDialog(status: GameOverEventArgs) {
    console.log(status);
  }
}
