import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { wanderScript, tileStatusScript } from 'src/app/game/ai';
import { TeamInfo } from 'src/app/game/objects/game-manager';
import { ITeamConfig, MonsterType, Side, StateChangeEvent } from 'src/app/game/objects/interfaces';
import { MainScene } from 'src/app/game/scenes/main.scene';
import { createGame, GameConfig, Game, GameEvent } from '../../game/game';

@Component({
  selector: 'tyl-game-host-container',
  templateUrl: './game-host-container.component.html',
  styleUrls: ['./game-host-container.component.scss']
})
export class GameHostContainerComponent implements OnInit, OnDestroy {
  @ViewChild('gameHost', { static: true }) hostElement: ElementRef<HTMLElement>;

  homeTeamConfig: ITeamConfig;
  awayTeamConfig: ITeamConfig;
  teamConfigs: ITeamConfig[] = [];
  private game: Game;
  private mainScene: MainScene;
  teamsInfo:TeamInfo[];
  isGameActive: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.populateTeamConfigs();
  }

  startGame(){

    //TODO: Try and reuse the main scene
    if(this.game){
      this.game.destroy(true);
    }

    const config: GameConfig = {
      parent: this.hostElement.nativeElement,
    }
    this.mainScene = new MainScene(this.homeTeamConfig, this.awayTeamConfig);

    this.game = createGame(config, this.mainScene);

    this.isGameActive = true;

    this.game.events.once(GameEvent.DESTROY, () => {
      console.log('Game destroyed');
    })

    this.mainScene.match.on(StateChangeEvent.ScoreBoardUpdate, (teams:TeamInfo[]) => {
      this.teamsInfo = teams;
    });

    this.mainScene.match.on(StateChangeEvent.GameOver, () =>{
      this.isGameActive = false;
    })

  }

  //TODO: We will want this to be hooked up to actual team data, mocking out some choices for now
  populateTeamConfigs(): void {
    const config1: ITeamConfig = {
      name: 'Mock Config 1',
      org: 'Mock Org 1',
      preferredMonsters: {
        [Side.Home]: MonsterType.Bobo,
        [Side.Away]: MonsterType.Triclops,
      },
      aiSrc: wanderScript,
    };

    const config2: ITeamConfig = {
      name: 'Mock Config 2',
      org: 'Mock Org 2',
      preferredMonsters: {
        [Side.Home]: MonsterType.Goldy,
        [Side.Away]: MonsterType.Pinky,
      },
      aiSrc: tileStatusScript,
    };
    this.teamConfigs.push(config1);
    this.teamConfigs.push(config2);
    this.homeTeamConfig = config1;
    this.awayTeamConfig = config2;
  }

  //Needed for html binding to actually store object in component on selection of config
  compareConfigs(o1: any, o2: any): boolean {
    return o1.name === o2.name;
  }

  ngOnDestroy(): void {
    if(this.game){
      this.game.destroy(false);
    }
  }
}
