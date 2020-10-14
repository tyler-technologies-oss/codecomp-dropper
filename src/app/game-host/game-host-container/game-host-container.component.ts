import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { wanderScript, tileStatusScript } from 'src/app/game/ai';
import { ITeamConfig, MonsterType, Side, StateChangeEvent } from 'src/app/game/objects/interfaces';
import { MainScene } from 'src/app/game/scenes/main.scene';
import { createGame, GameConfig, Game, GameEvent } from '../../game/game';
import Papa from 'papaparse';
import { first, map } from 'rxjs/operators';
import { TeamInfo } from '../../game/game';
import { GameService } from '../game.service';
import { Subscription } from 'rxjs';

const getTeamName = () => map<TeamInfo, string>(({ teamName }) => teamName);
const getTeamScore = () => map<TeamInfo, number>(({ totalTilesDecremented }) => totalTilesDecremented);

@Component({
  selector: 'tyl-game-host-container',
  templateUrl: './game-host-container.component.html',
  styleUrls: ['./game-host-container.component.scss']
})
export class GameHostContainerComponent implements OnInit, OnDestroy {
  @ViewChild('gameHost', { static: true }) hostElement: ElementRef<HTMLElement>;

  homeTeamName$ = this.gameService.homeTeamInfo$.pipe(getTeamName());
  awayTeamName$ = this.gameService.awayTeamInfo$.pipe(getTeamName());
  homeTeamScore$ = this.gameService.homeTeamInfo$.pipe(getTeamScore());
  awayTeamScore$ = this.gameService.awayTeamInfo$.pipe(getTeamScore());
  pause$ = this.gameService.isPaused$;
  homeTeamConfig: ITeamConfig;
  awayTeamConfig: ITeamConfig;
  teamConfigs: ITeamConfig[] = [];
  showScoreBoard: boolean = false;
  showTeamConfigs: boolean = true;
  gameOverSubscription: Subscription = this.gameService.gameOver$.subscribe(args => {
    this.showTeamConfigs = true;
  });

  constructor(private gameService: GameService) {
  }

  startGame() {
    this.gameService.setTeamConfigs(this.homeTeamConfig, this.awayTeamConfig);
    this.showScoreBoard = true;
    this.showTeamConfigs = false;
  }

  ngOnInit(): void {
    this.populateTeamConfigs();//TODO: Move to a team config service
    this.hostElement.nativeElement.appendChild(this.gameService.containerElement);
    this.gameService.resume();
  }

  ngOnDestroy(): void {
    this.gameService.pause();
    this.hostElement.nativeElement.removeChild(this.gameService.containerElement);
  }

  pause() {
    this.gameService.isPaused$.pipe(first()).subscribe(paused => !paused ?
      this.gameService.pause() : this.gameService.resume())
  }

  onAddTeam(teamConfig: ITeamConfig){
    this.teamConfigs.push(teamConfig);
  }

  readTeamCSV(url: string): void {
    var that = this;

    Papa.parse(url, {
      header: true,
      download: true,
      error(error, file) {
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
            org: element['School']
          };
          that.teamConfigs.push(team);
        });
        console.log(that.teamConfigs);
      }
    });

  }

  populateTeamConfigs(): void {

    // TODO: reference remote csv instead of local copy
    const teamsPath = '/assets/matchSetup';
    this.readTeamCSV(`${teamsPath}/CodeSubmission.csv`);

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

  // Needed for html binding to actually store object in component on selection of config
  compareConfigs(o1: any, o2: any): boolean {
    return o1.name === o2.name;
  }

}
