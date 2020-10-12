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


    // Setup our reset button
    const reset = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.R);
    reset.on(Input.Keyboard.Events.UP, function (this: MainScene) {
      console.log('Resetting match...');
      this.match?.reset();
    }, this);
    console.log(`Press 'R' to reset!`);
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
