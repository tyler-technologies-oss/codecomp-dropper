import { Scene, Input, Events, GameObjects, Math as PMath } from 'phaser';
import { loadMonsterAssets, createAllMonsterAnimFrames, MonstersAtlas, MonsterAnim } from '../objects/monster'
import { TileGrid, squareGrid } from '../objects/grid';
import { MatchEventArgs, ITeamConfig, MonsterType, Side, StateChangeEvent, TileState, MatchEvent } from '../objects/interfaces';
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
import { loadTileAssets } from '../objects/tile';
import { BroomAtlas, BroomEastFacingOrigin, IdleEastFacingHandPositions, RestWestFacingHandPositions, createBroomAnimFrames, loadBroomAssets, SweepEastFacingHandPositions, BroomWestFacingOrigin } from '../objects/broom';
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
    createBroomAnimFrames(this.anims);
    this.background = new Background(this);
    this.match.on(MatchEvent.GameEnd, this.gameOverEvent, this);
    this.gameEnd = new GameEnd();

    // Setup our reset button
    const reset = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.R);
    reset.on(Input.Keyboard.Events.UP, function (this: MainScene) {
      console.log('Resetting match...');
      this.match?.reset(); 
      this.gameEnd?.reset();
    }, this);
    console.log(`Press 'R' to reset!`);

    // setup home team
    const homeTeamConfig: ITeamConfig = {
      name: 'Home',
      org: 'Tyler',
      preferredMonsters: {
        [Side.Home]: MonsterType.Goldy,
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
        [Side.Home]: MonsterType.Spike,
        [Side.Away]: MonsterType.Bobo,
      },
      aiSrc: tileStatusScript,
    };
    const awayTeam = new Team(this, awayTeamConfig);

    const grid = squareGrid(this, this.scale, 5);

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
    loadTileAssets(this);
    loadBroomAssets(this);
    loadGameEndAssets(this);
  }

  update(time: number, dt: number) {
    this.background.update(dt); 
    this.gameEnd.update(dt);
  }

  gameOverEvent(args: MatchEventArgs){
    const winningSide = args.state === 'homeTeamWins' ? 'home' : 'away';
    const victoryMonsterType = winningSide === 'home' ? args.team.home.monsterType : args.team.away.monsterType;
    const defeatMonsterType = winningSide === 'home' ? args.team.away.monsterType : args.team.home.monsterType;
    this.match.hide();
    this.gameEnd.init(this, winningSide, victoryMonsterType, defeatMonsterType);
  }
}
