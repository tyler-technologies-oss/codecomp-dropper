import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { wanderScript, tileStatusScript } from 'src/app/game/ai';
import { ITeamConfig, MonsterType, Side } from 'src/app/game/objects/interfaces';
import { createGame, GameConfig, Game, GameEvent } from '../../game/game';
import Papa from 'papaparse';


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
    if (this.game != null){
      this.game.destroy(false);
    }
  }

  startGame(){
    const config: GameConfig = {
      parent: this.hostElement.nativeElement,
    };

    this.game = createGame(config, this.homeTeamConfig, this.awayTeamConfig);

    this.game.events.once(GameEvent.DESTROY, () => {
      console.log('Game destroyed');
    });
  }

  readTeamCSV(url: string): void {
    var that = this;

    Papa.parse(url, {
        header: true,
        download: true,
        error(error, file){
          console.log('Error parsing file: ' + file);
          console.log(error);
        },
        complete(results) {
          console.log('Completed Parse:' + results);
          results.data.forEach(element => {
            let team: ITeamConfig = {
                    name: element['Team Name'],
                    preferredMonsters: {
                      [Side.Home]: element['Home Monster Choice'].toLowerCase() as MonsterType,
                      [Side.Away]: element['Away Monster Choice'].toLowerCase() as MonsterType,
                    },
                    aiSrc: element['URL/Code'],
                    school: element['School']
                  };
            that.teamConfigs.push(team);
        });
          console.log(that.teamConfigs);
        }});

  }

  populateTeamConfigs(): void {

    // TODO: reference remote csv instead of local copy
    const teamsPath = '/assets/matchSetup';
    this.readTeamCSV(`${teamsPath}/CodeSubmission.csv`);

    const config1: ITeamConfig = {
      name: 'Mock Config 1',
      preferredMonsters: {
        [Side.Home]: MonsterType.Bobo,
        [Side.Away]: MonsterType.Triclops,
      },
      aiSrc: wanderScript,
      school: 'Tyler Tech'
    };

    const config2: ITeamConfig = {
      name: 'Mock Config 2',
      preferredMonsters: {
        [Side.Home]: MonsterType.Goldy,
        [Side.Away]: MonsterType.Pinky,
      },
      aiSrc: tileStatusScript,
      school: 'Tyler Tech'
    };
    this.teamConfigs.push(config1);
    this.teamConfigs.push(config2);
    this.homeTeamConfig = config1;
    this.awayTeamConfig = config2;
  }

  // Needed for html binding to actually store object in component on selection of config
  compareConfigs(o1: any, o2: any): boolean {
    return o1.name === o2.name;
  }

  parseMonster(name: string): MonsterType{
    return MonsterType[name.toLowerCase()];
    return MonsterType.Bobo;
  }

}
