import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Game, Core } from 'phaser';
import { defaultConfig, MainScene } from '../game'


@Component({
  selector: 'tyl-phaser-game',
  templateUrl: './phaser-game.component.html',
  styleUrls: ['./phaser-game.component.scss']
})
export class PhaserGameComponent implements OnInit, OnDestroy {
  @ViewChild('phaserHost', {static: true}) hostElement: ElementRef<HTMLElement>;

  phaserGame: Game;

  constructor() {}

  ngOnInit() {
    this.phaserGame = new Game({...defaultConfig, scene: [MainScene], parent: this.hostElement.nativeElement});
    this.phaserGame.events.once(Core.Events.DESTROY, () => console.log('Game destroyed'));
  }

  ngOnDestroy() {
    this.phaserGame.destroy(false)
  }
}
