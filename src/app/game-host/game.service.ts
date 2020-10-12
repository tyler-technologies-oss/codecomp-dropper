import { Injectable } from '@angular/core';
import { Scene } from 'phaser';
import { fromEvent, fromEventPattern, Observable, ReplaySubject, from, merge } from 'rxjs';
import { first, map, mergeMap, shareReplay, switchMap, tap, mapTo, startWith } from 'rxjs/operators';
import { createGame, Game, GameEvent, SceneEvent, MainKey } from '../game/game';
import { IMatchConfig, TeamInfo } from '../game/objects/game-manager';
import { TileGrid } from '../game/objects/grid';
import { ITeamConfig, Side, StateChangeEvent } from '../game/objects/interfaces';
import { Team } from '../game/objects/team';
import { MainScene } from '../game/scenes/main.scene';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private game$ = new ReplaySubject<Game>(1);
  private mainScene$ = this.game$.pipe(
    map(game => game.scene.getScene(MainKey) as MainScene),
    shareReplay(1),
  );

  teamsInfo$ = this.mainScene$.pipe(
    switchMap(mainScene => fromEvent<Record<Side, TeamInfo>>(mainScene.match, StateChangeEvent.ScoreBoardUpdate)),
    shareReplay(1),
  );

  homeTeamInfo$ = this.teamsInfo$.pipe(
    map(teamsInfo => teamsInfo[Side.Home]),
    shareReplay(1),
  );
  awayTeamInfo$ = this.teamsInfo$.pipe(
    map(teamsInfo => teamsInfo[Side.Away]),
    shareReplay(1),
  );

  isPaused$ = this.mainScene$.pipe(
    mergeMap(scene => merge(
      fromEvent(scene.events, SceneEvent.PAUSE).pipe(mapTo(true)),
      fromEvent(scene.events, SceneEvent.RESUME).pipe(mapTo(false))
    ).pipe(startWith(scene.scene.isPaused(MainKey)))),
  );

  readonly containerElement: HTMLDivElement;

  constructor() {
    const parent = document.createElement('div');
    parent.style.flex = "1 1 auto";
    this.containerElement = parent;

    from(createGame({ parent })).subscribe(game => this.game$.next(game));
  }

  pause() {
    this.mainScene$.pipe(first()).subscribe(scene => scene.scene.pause(MainKey));
  }

  resume() {
    this.mainScene$.pipe(first()).subscribe(scene => scene.scene.resume(MainKey));
  }

  setTeamConfigs(homeTeamConfig: ITeamConfig, awayTeamConfig: ITeamConfig) {
    this.mainScene$.pipe(first()).subscribe(scene => {

      const gridSize = 5;
      const cellSize = scene.scale.height / (gridSize + 2);
      const gridHeight = cellSize * gridSize;
      const gridWidth = cellSize * gridSize;
      const gridY = cellSize;
      const gridX = (scene.scale.width - gridWidth) / 2;
      const grid = new TileGrid(scene, gridX, gridY, gridWidth, gridHeight, gridSize);

      // setup home team
      const homeTeam = new Team(scene, homeTeamConfig);

      // setup away team
      const awayTeam = new Team(scene, awayTeamConfig);

      // create the match
      const matchConfig: IMatchConfig = {
        grid,
        teams: {
          [Side.Home]: homeTeam,
          [Side.Away]: awayTeam,
        },
        startLocations: {
          [Side.Home]: [grid.getTileAtIndex(0, 0), grid.getTileAtIndex(0, 2), grid.getTileAtIndex(0, 4)],
          [Side.Away]: [grid.getTileAtIndex(4, 0), grid.getTileAtIndex(4, 2), grid.getTileAtIndex(4, 4)],
        }
      };

      scene.match.initMatch(matchConfig);
    });
  }
}
