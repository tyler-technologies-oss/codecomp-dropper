import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TeamInfo } from 'src/app/game/objects/game-manager';
import { GameOverEventArgs, Side, StateChangeEvent, StateUpdatedEventArgs } from 'src/app/game/objects/interfaces';
import { Team } from 'src/app/game/objects/team';
import { MainScene } from 'src/app/game/scenes/main.scene';
import { createGame, GameConfig, Game, GameEvent } from '../../game/game';

@Component({
  selector: 'tyl-game-host-container',
  templateUrl: './game-host-container.component.html',
  styleUrls: ['./game-host-container.component.scss']
})
export class GameHostContainerComponent implements OnInit, OnDestroy {
  @ViewChild('gameHost', { static: true }) hostElement: ElementRef<HTMLElement>;

  private game: Game;
  private mainScene: MainScene;
  teamsInfo:TeamInfo[];

  constructor() { }

  ngOnInit(): void {
    const config: GameConfig = {
      parent: this.hostElement.nativeElement,
    }
    this.mainScene = new MainScene();

    this.game = createGame(config, this.mainScene);

    this.game.events.once(GameEvent.DESTROY, () => {
      console.log('Game destroyed');
    })

    this.mainScene.match.on(StateChangeEvent.ScoreBoardUpdate, (teams:TeamInfo[]) => {
      this.teamsInfo = teams;
    });
  }


  ngOnDestroy(): void {
    this.game.destroy(false);
  }

}
