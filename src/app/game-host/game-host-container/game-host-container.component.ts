import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { TeamInfo } from '../../game/game';
import { GameService } from '../game.service';

const getTeamName = () => map<TeamInfo, string>(({teamName}) => teamName);
const getTeamScore = () => map<TeamInfo, number>(({totalTilesDecremented}) => totalTilesDecremented);

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

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
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
}
