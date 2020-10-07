import { Scene, Input, GameObjects } from 'phaser';
import { loadMonsterAssets, createAllMonsterAnimFrames } from '../objects/monster'
import { TileGrid } from '../objects/grid';
import { GameOverEventArgs, ITeamConfig, MonsterType, Side, StateChangeEvent, TileState } from '../objects/interfaces';
import { Team} from '../objects/team';
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


export class MainScene extends Scene {
  match: GameManager;
  background: Background;
  homeTeamConfig: ITeamConfig;
  awayTeamConfig: ITeamConfig;

  constructor(homeTeamConfig: ITeamConfig, awayTeamConfig: ITeamConfig) {
    super({ key: 'main' });
    this.homeTeamConfig = homeTeamConfig;
    this.awayTeamConfig = awayTeamConfig;
  }

  create() {
    // initialize all the animations
    createAllMonsterAnimFrames(this.anims);
    this.background = new Background(this);


    // Setup our reset button
    const reset = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.R);
    reset.on(Input.Keyboard.Events.UP, function (this: MainScene) {
      console.log('Resetting match...');
      this.match?.reset();
    }, this);
    console.log(`Press 'R' to reset!`);

    const gridSize = 5;
    const cellSize = this.scale.height / (gridSize + 2);
    const gridHeight = cellSize * gridSize;
    const gridWidth = cellSize * gridSize;
    const gridY = cellSize;
    const gridX = (this.scale.width - gridWidth) / 2;
    const grid = new TileGrid(this, gridX, gridY, gridWidth, gridHeight, gridSize);


    // setup home team
    const homeTeamConfig: ITeamConfig = {
      name: 'Home',
      org: 'Tyler',
      preferredMonsters: {
        [Side.Home]: MonsterType.Bobo,
        [Side.Away]: MonsterType.Triclops,
      },
      aiSrc: wanderScript,
    };
    const homeTeam = new Team(this, homeTeamConfig);

    // setup away team
    const awayTeamConfig: ITeamConfig = {
      name: 'Away',
      org: 'Tyler',
      preferredMonsters: {
        [Side.Home]: MonsterType.Triclops,
        [Side.Away]: MonsterType.Bobo,
      },
      aiSrc: tileStatusScript,
    };
    const awayTeam = new Team(this, awayTeamConfig);


    this.match = new GameManager();
    this.match.on(StateChangeEvent.GameOver, (status: GameOverEventArgs) => {
      this.showGameOverDialog(status);
    });

    // create the match
    const matchConfig: IMatchConfig = {
      grid,
      teams: {
        [Side.Home]: homeTeam,
        [Side.Away]: awayTeam,
      },
      startLocations: {
        [Side.Home]: [grid.getTileAtIndex(0, 0), grid.getTileAtIndex(0, 2), grid.getTileAtIndex(0, 4)],
        [Side.Away]: [grid.getTileAtIndex(4, 0), grid.getTileAtIndex(4, 2), grid.getTileAtIndex(4, 4)],
      }
    };
    this.match.initMatch(matchConfig);
  }

  preload() {
    loadBackgroundAssets(this);
    loadMonsterAssets(this);
  }

  update(time: number, dt: number) {
    this.background.update(dt)
  }

  showGameOverDialog(status: GameOverEventArgs){
    console.log(status);
  }
}
