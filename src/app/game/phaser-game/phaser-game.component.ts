import { Component, OnInit } from '@angular/core';
import { Game, Scene, Types, AUTO } from 'phaser';
import { GameContainerComponent } from '../game-container/game-container.component';

type GameConfig = Types.Core.GameConfig;

class MainScene extends Scene {
  constructor() {
    super({ key: 'main' });
  }
  create() {
    console.log('create method');
  }
  preload() {
    console.log('preload method');
  }
  update() {
    console.log('update method');
  }
}

@Component({
  selector: 'tyl-phaser-game',
  templateUrl: './phaser-game.component.html',
  styleUrls: ['./phaser-game.component.scss']
})
export class PhaserGameComponent implements OnInit {
  phaserGame: Game;
  config: GameConfig;


  constructor() {
    this.config = {
      type: AUTO,
      height: 600,
      width: 800,
      scene: [MainScene],
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y: 100}
        }
      }
    };
  }

  ngOnInit(): void {
    this.phaserGame = new Game(this.config);
  }

}
