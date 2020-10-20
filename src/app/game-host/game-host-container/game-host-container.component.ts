import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { wanderScript, tileStatusScript } from 'src/app/game/ai';
import { ITeamConfig, MonsterType, Side, StateChangeEvent } from 'src/app/game/objects/interfaces';
import { MainScene } from 'src/app/game/scenes/main.scene';
import { createGame, GameConfig, Game, GameEvent } from '../../game/game';
import { parse } from 'papaparse';
import { first, map } from 'rxjs/operators';
import { TeamInfo } from '../../game/game';
import { GameService } from '../game.service';
import { TeamConfigsService } from '../team-configs.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  //TODO: Figure out the flow of data w/events to properly hide / show UI elements
  showScoreBoard: boolean = true;
  showTeamConfigs: boolean = true;
  // gameOverSubscription: Subscription = this.gameService.gameOver$.subscribe(args => {
  //   this.showTeamConfigs = true;
  // });

  constructor(private gameService: GameService, private snackBar: MatSnackBar,  private configService: TeamConfigsService) {}

  ngOnInit(): void {
    this.populateTeamConfigs();
    this.hostElement.nativeElement.appendChild(this.gameService.containerElement);
    this.gameService.resume();
  }

  ngOnDestroy(): void {
    this.gameService.pause();
    this.hostElement.nativeElement.removeChild(this.gameService.containerElement);
  }

  startGame() {
    this.gameService.setTeamConfigs(this.homeTeamConfig, this.awayTeamConfig);
    // this.showScoreBoard = true;
    // this.showTeamConfigs = false;
  }

  resetGame(){
    this.gameService.resetGame();
  }

  pause() {
    this.gameService.isPaused$.pipe(first()).subscribe(paused => !paused ?
      this.gameService.pause() : this.gameService.resume())
  }

  onAddTeam(teamConfig: ITeamConfig) {
    this.configService.teamConfigs.push(teamConfig);
    this.snackBar.open("Configuration added: " + teamConfig.name, "Dismiss", { duration: 5000 });
  }

  populateTeamConfigs(): void {
    this.configService.parseTeamConfigs().subscribe(teamConfigs => {
      console.log("teamConfigs: " + teamConfigs.toString());
      this.homeTeamConfig = this.configService.developmentConfig;
      if(teamConfigs.length > 1){
        this.awayTeamConfig = teamConfigs[1];
      }
    });
  }

  // Needed for html binding to actually store object in component on selection of config
  compareConfigs(o1: any, o2: any): boolean {
    return o1.name === o2.name;
  }

  getTeamConfigs(){
    return this.configService.teamConfigs;
   }

}
