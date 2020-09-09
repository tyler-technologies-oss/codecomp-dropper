import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { createGame, GameConfig, Game, GameEvent } from '../../game/game';

@Component({
  selector: 'tyl-game-host-container',
  templateUrl: './game-host-container.component.html',
  styleUrls: ['./game-host-container.component.scss']
})
export class GameHostContainerComponent implements OnInit, OnDestroy {
  @ViewChild('gameHost', {static: true}) hostElement: ElementRef<HTMLElement>;

  private game: Game;

  constructor() { }

  ngOnInit(): void {
    const config: GameConfig = {
      parent: this.hostElement.nativeElement,
    }

    this.game = createGame(config);

    this.game.events.once(GameEvent.DESTROY, () => {
      console.log('Game destroyed');
    })
  }

  ngOnDestroy(): void {
    this.game.destroy(false);
  }

}
