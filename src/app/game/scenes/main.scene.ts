import { Scene, Input, Events, GameObjects, Math as PMath } from 'phaser';
import { loadMonsterAssets, createAllMonsterAnimFrames, MonstersAtlas } from '../objects/monster'
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
import { createAllGameEndAnimFrames, GameOver } from '../objects/game-over';

enum GameEndState {
  SweepMove = 'sweep_move',
  SweepIdle = 'sweep_idle',
  SweepResting = 'sweep_resting',
}

export const MainKey = 'main';

export class MainScene extends Scene {
  match: GameManager;
  background: Background;
  victoryMonster: GameObjects.Sprite;
  defeatMonster: GameObjects.Sprite;
  private gameEndTime = 0;
  private gameEndLoop = 1500;
  isGameOver = false;

  constructor() {
    super({ key: MainKey });
    this.match = new GameManager();
  }

  create() {
    // initialize all the animations
    createAllMonsterAnimFrames(this.anims);
    createAllGameEndAnimFrames(this.anims);
    this.background = new Background(this);
    // this.gameOver = new GameOver(this);
    // this.gameEndInit(MonsterType.Triclops, MonsterType.Bobo);
    // this.gameOver.play();

    this.match.on(MatchEvent.GameEnd, this.gameOverEvent, this);

    // Setup our reset button
    const reset = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.R);
    reset.on(Input.Keyboard.Events.UP, function (this: MainScene) {
      console.log('Resetting match...');
      this.match?.reset(); 
      this.victoryMonster.destroy();
      this.defeatMonster.destroy();
      this.gameEndTime = 0;
    }, this);
    console.log(`Press 'R' to reset!`);

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
  }

  update(time: number, dt: number) {
    this.background.update(dt);
    if (this.isGameOver) {
      console.log('isGameOver');
      this.gameEndUpdate(dt);
    }
  }

  gameOverEvent(args: MatchEventArgs){
    const winningSide = args.state === 'homeTeamWins' ? 'home' : 'away';
    const victoryMonsterType = winningSide === 'home' ? args.team.home.monsterType : args.team.away.monsterType;
    const defeatMonsterType = winningSide === 'home' ? args.team.away.monsterType : args.team.home.monsterType;
    console.log('Game end');
    this.match.hide();
    this.gameEndInit(victoryMonsterType, defeatMonsterType);
    // this.gameOver.play();
  }

  private gameEndInit(victoryMonsterType: MonsterType, defeatMonsterType: MonsterType) {
    this.isGameOver = true;
    // Title
    // move victory monster walking and pushing broom
    // move defeat monster knocked out and sliding on ground
    // make background
    this.victoryMonster = new GameObjects.Sprite(
      this, 
      300, 
      600, 
      MonstersAtlas, 
    );

    this.victoryMonster.flipX = true;
    this.victoryMonster.state = GameEndState.SweepIdle;

    this.defeatMonster = new GameObjects.Sprite(
      this,
      700,
      620,
      MonstersAtlas,
    );
    this.defeatMonster.state = GameEndState.SweepIdle;

    this.add.existing(this.victoryMonster);
    this.add.existing(this.defeatMonster);
    // this.victoryMonster.setVisible(true);
    // this.defeatMonster.setVisible(true);
    // this.setVisible(true);
    // const victoryAnim = `${victoryMonsterType}_idle`;
    // const defeatAnim = `${defeatMonsterType}_dead_sweep_idle`;
    // console.log('Play Game End Scene', victoryAnim, defeatAnim);
    // this.victoryMonster.play(victoryAnim);
    // this.defeatMonster.play(defeatAnim);
  }

  private gameEndUpdate(dt) {
    this.gameEndTime += dt;

    const i = this.gameEndTime > 0 ? Math.floor(this.gameEndTime / this.gameEndLoop) : 0;
    // console.log(i);
    if ((i % 2) < 1 && i < 6) {
      const x = i / 2 * 300;
      this.moveVictoryMonster(300 + x, 600 + x);
    } else if (i === 6) {
      this.victoryMonster.flipX = false;
    } else if (i > 6) {
      this.isGameOver = false;
      this.gameEndTime = 0;
    }
  }

  private moveVictoryMonster(x1: number, x2: number) {
    const normalizedTime = PMath.Clamp((this.gameEndTime % this.gameEndLoop) / this.gameEndLoop, 0, 1);
    const x = PMath.Interpolation.Linear([x1, x2], normalizedTime);
    this.victoryMonster.setPosition(x, 600);
    this.defeatMonster.setPosition(x + 400, 620);
  }

}
