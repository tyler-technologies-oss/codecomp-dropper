import { Scene, Input } from 'phaser';
import { loadMonsterAssets, createAllMonsterAnimFrames } from '../objects/monster'
import { TileGrid } from '../objects/grid';
import { ITeamConfig, MonsterType, Side } from '../objects/interfaces';
import { Team} from '../objects/team';
import { tileStatusScript, idleScript, idleErrorScript, wanderScript } from '../ai';
import { GameManager, IMatchConfig } from '../objects/game-manager';


export class MainScene extends Scene {
  match: GameManager;

  constructor() {
    super({ key: 'main' });
  }

  create() {
    // initialize all the animations
    createAllMonsterAnimFrames(this.anims);

    // Setup our reset button
    const reset = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.R);
    reset.on(Input.Keyboard.Events.UP, function (this: MainScene) {
      console.log('Resetting match...');
      this.match?.reset();
    }, this);
    console.log(`Press 'R' to reset!`);

    // setup the game board
    const baseOffset = 50;
    const grid = new TileGrid(this, baseOffset, baseOffset, this.scale.width - (baseOffset * 2), this.scale.height - (baseOffset * 2), 5);

    // setup home team
    const homeTeamConfig: ITeamConfig = {
      name: 'Bobo',
      preferredMonsters: {
        [Side.Home]: MonsterType.Bobo,
        [Side.Away]: MonsterType.Triclops,
      },
      aiSrc: tileStatusScript,
    };
    const homeTeam = new Team(this, homeTeamConfig);

    // setup away team
    const awayTeamConfig: ITeamConfig = {
      name: 'Triclops',
      preferredMonsters: {
        [Side.Home]: MonsterType.Bobo,
        [Side.Away]: MonsterType.Triclops,
      },
      aiSrc: tileStatusScript,
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
  }

  update(time: number, dt: number) {
    this.match.update(dt);
  }
}
