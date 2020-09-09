import { Component, OnInit } from '@angular/core';
import { Game } from 'phaser';
import { defaultConfig, MainScene } from '../game'


@Component({
  selector: 'tyl-phaser-game',
  templateUrl: './phaser-game.component.html',
  styleUrls: ['./phaser-game.component.scss']
})
export class PhaserGameComponent implements OnInit {
  phaserGame: Game;

  constructor() {}

  ngOnInit(): void {
    this.phaserGame = new Game({...defaultConfig, scene: [MainScene]});
  }

}
