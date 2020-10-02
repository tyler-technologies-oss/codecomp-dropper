import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { wanderScript, tileStatusScript } from 'src/app/game/ai';
import { ITeamConfig, MonsterType, Side } from 'src/app/game/objects/interfaces';
import { createGame, GameConfig, Game, GameEvent } from '../../game/game';

@Component({
  selector: 'tyl-game-host-container',
  templateUrl: './game-host-container.component.html',
  styleUrls: ['./game-host-container.component.scss']
})
export class GameHostContainerComponent implements OnInit, OnDestroy {
  @ViewChild('gameHost', {static: true}) hostElement: ElementRef<HTMLElement>;

  game: Game = null;
  homeTeamConfig: ITeamConfig;
  awayTeamConfig: ITeamConfig;
  teamConfigs: ITeamConfig[] = [];

  constructor() { }

  ngOnInit(): void {
    this.populateTeamConfigs();
  }

  ngOnDestroy(): void {
    this.game.destroy(false);
  }

  startGame(){
    const config: GameConfig = {
      parent: this.hostElement.nativeElement,
    }

    this.game = createGame(config, this.homeTeamConfig, this.awayTeamConfig);

    this.game.events.once(GameEvent.DESTROY, () => {
      console.log('Game destroyed');
    })
  }

  //TODO: We will want this to be hooked up to actual team data, mocking out some choices for now
  populateTeamConfigs(): void {
    const config1: ITeamConfig = {
      name: 'Mock Config 1',
      preferredMonsters: {
        [Side.Home]: MonsterType.Bobo,
        [Side.Away]: MonsterType.Triclops,
      },
      aiSrc: wanderScript,
    };

    const config2: ITeamConfig = {
      name: 'Mock Config 2',
      preferredMonsters: {
        [Side.Home]: MonsterType.Goldy,
        [Side.Away]: MonsterType.Pinky,
      },
      aiSrc: tileStatusScript,
    };
    this.teamConfigs.push(config1);
    this.teamConfigs.push(config2);
  }

  //Needed for html binding to actually store object in component on selection of config
  compareConfigs(o1: any, o2: any): boolean {
    return o1.name === o2.name;
  }

}
