import { Scene, Input } from 'phaser';
import { loadMonsterAssets, createAllMonsterAnimFrames } from '../objects/monster'
import { TileGrid } from '../objects/grid';
import { ITeamConfig, MonsterType, Side } from '../objects/interfaces';
import { Team} from '../objects/team';
import { wanderScript, idleScript, idleErrorScript } from '../ai';
import { GameManager, IMatchConfig } from '../objects/game-manager';


export class MainScene extends Scene {
  match: GameManager;

  backgroundTileSprites: Phaser.GameObjects.TileSprite[] = [];
  constructor() {
    super({ key: 'main' });
  }

  create() {
    this.backgroundTileSprites.push(createBackgroundTile(this, '1'));
    this.backgroundTileSprites.push(createBackgroundTile(this, '2'));
    this.backgroundTileSprites.push(createBackgroundTile(this, '3'));
    this.backgroundTileSprites.push(createBackgroundTile(this, '4'));
    this.backgroundTileSprites.push(createBackgroundTile(this, '5'));
    this.backgroundTileSprites.push(createBackgroundTile(this, '6'));

    // initialize all the animations
    createAllMonsterAnimFrames(this.anims);

    // Setup our reset button
    const reset = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.R);
    reset.on(Input.Keyboard.Events.UP, function (this: MainScene) {
      console.log('Resetting match...');
      this.match?.reset();
    }, this);
    console.log(`Press 'R' to reset!`);

    // todo try to add dynamic scaling
    const boardSize = this.scale.height - 100;
    const x = (this.scale.width - boardSize) / 2;
    const y = (this.scale.height - boardSize) / 2;
    const grid = new TileGrid(this, x, y, boardSize, boardSize, 5);
    
    // setup home team
    const homeTeamConfig: ITeamConfig = {
      name: 'Bobo',
      preferredMonsters: {
        [Side.Home]: MonsterType.Bobo,
        [Side.Away]: MonsterType.Triclops,
      },
      aiSrc: wanderScript,
    };
    const homeTeam = new Team(this, homeTeamConfig);

    // setup away team
    const awayTeamConfig: ITeamConfig = {
      name: 'Triclops',
      preferredMonsters: {
        [Side.Home]: MonsterType.Bobo,
        [Side.Away]: MonsterType.Triclops,
      },
      aiSrc: wanderScript,
    };
    const awayTeam = new Team(this, awayTeamConfig);

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
    this.match = new GameManager();
    this.match.initMatch(matchConfig);
  }

  preload() {
    loadMonsterAssets(this);
    this.load.image('1', 'assets/background/Halloween/1.png');
    this.load.image('2', 'assets/background/Halloween/2.png');
    this.load.image('3', 'assets/background/Halloween/3.png');
    this.load.image('4', 'assets/background/Halloween/4.png');
    this.load.image('5', 'assets/background/Halloween/5.png');
    this.load.image('6', 'assets/background/Halloween/6.png');
    this.load.image('7', 'assets/background/Halloween/7.png');
    this.load.image('8', 'assets/background/Halloween/8.png');
    this.load.image('9', 'assets/background/Halloween/9.png');
  }

  update(time: number, dt: number) {
    this.backgroundTileSprites[1].tilePositionX -= 0.2;
    this.match.update(dt);
  }

  showGameOverDialog(team: string){

  }
}
