import { Events, Game } from 'phaser';
import { TileGrid } from './grid';
import { IGameState, ILocation, MoveSet, Side, StateChangeEvent, StateUpdatedEventArgs, TeamStates } from './interfaces';
import { Team, TeamState } from './team';

export enum GameState {
  Initializing = 'initializing',
  Thinking = 'thinking',
  Updating = 'updating',
  HomeTeamWins = 'homeTeamWins',
  AwayTeamWins = 'awayTeamWins',
  Error = 'error',
  Draw = 'draw',
}

export type Teams = Record<Side, Team>;
export type StartLocations = Record<Side, ILocation[]>;

export interface IMatchConfig {
  grid: TileGrid;
  teams: Teams;
  startLocations: StartLocations;
}

export class GameManager {
  private eventEmitter = new Events.EventEmitter();

  private _state: GameState = GameState.Initializing;
  get state() { return this._state; }

  private matchConfig: IMatchConfig;

  private teams: Teams;
  private grid: TileGrid;
  private readonly sides = Object.values(Side);

  private readonly thinkingTime = 2000;

  constructor() {
  }

  reset() {
    this.sides.forEach(side => this.teams[side].reset());
    this.initialize();
  }

  initMatch(matchConfig: IMatchConfig) {
    this.matchConfig = matchConfig;
    this.initialize();
  }

  update(dt: number) {

  }

  on(event: string | symbol, fn: Function, context?: any): this {
    this.eventEmitter.on(event, fn, context);
    return this;
  }

  addListener(event: string | symbol, fn: Function, context?: any): this {
    this.eventEmitter.addListener(event, fn, context);
    return this;
  }

  once(event: string | symbol, fn: Function, context?: any): this {
    this.eventEmitter.once(event, fn, context);
    return this;
  }

  removeListener(event: string | symbol, fn?: Function, context?: any, once?: boolean): this {
    this.eventEmitter.removeListener(event, fn, context, once);
    return this;
  }

  off(event: string | symbol, fn?: Function, context?: any, once?: boolean): this {
    this.eventEmitter.off(event, fn, context, once);
    return this;
  }

  removeAllListeners(event?: string | symbol): this {
    this.eventEmitter.removeAllListeners(event);
    return this;
  }

  private async initialize() {
    this.setState(GameState.Initializing);
    const {teams, grid, startLocations} = this.matchConfig;
    this.teams = teams;
    this.grid = grid;

    // wait for all scripts to load
    const promises = [
      this.teams[Side.Home].setupTeam(startLocations[Side.Home], Side.Home),
      this.teams[Side.Away].setupTeam(startLocations[Side.Away], Side.Away),
    ];
    const allSettled = Promise.allSettled(promises);
    const promiseResults = await allSettled;

    console.log(promiseResults);

    const teamIsSetup:  Record<Side, boolean> = {
      [Side.Home]: promiseResults[0].status === 'fulfilled',
      [Side.Away]: promiseResults[1].status === 'fulfilled',
    };

    if(teamIsSetup[Side.Home] && teamIsSetup[Side.Away]) {
      this.setState(GameState.Thinking);
    } else if (!teamIsSetup[Side.Home] && !teamIsSetup[Side.Away]) {
      this.setState(GameState.Draw);
    } else if (teamIsSetup[Side.Home] && !teamIsSetup[Side.Away]) {
      this.setState(GameState.HomeTeamWins);
    } else {
      this.setState(GameState.AwayTeamWins);
    }
  }

  private async updateMoves() {

    const serializedGameState: IGameState = {
      tileStates: this.grid.serialize(),
      teamStates: this.sides.reduce((states: TeamStates, side) => {
        states[side] = this.teams[side].serialize();
        return states;
      }, {} as TeamStates)
    };

    const promises = this.sides.map(side => this.teams[side].getNextMovesAsync(serializedGameState, this.thinkingTime));
    const allSettled = Promise.allSettled(promises);
    const promisedResults = await allSettled;
    const results = promisedResults.map(pr => {

      if(pr.status === 'rejected') {
        const prRejected = pr as PromiseRejectedResult;
        return prRejected.reason;
      } else {
        const prFulfilled = pr as PromiseFulfilledResult<MoveSet>;
        return prFulfilled.value;
      }
    });

    console.log('promiseResults', results);

  }

  private exitState(state: GameState) {

  }

  private enterState(state: GameState) {
    switch(state) {
      case GameState.Thinking:
        this.updateMoves();
        break;
      case GameState.HomeTeamWins:
        this.teams[Side.Home].win();
        break;
      case GameState.AwayTeamWins:
        this.teams[Side.Away].win();
        break;
    }
  }

  private transitionState(nextState: GameState) {
    if (this.state === GameState.Draw ||
        this.state === GameState.Error ||
        this.state === GameState.HomeTeamWins ||
        this.state === GameState.AwayTeamWins
    ){
      return false;
    }

    this._state = nextState;
    return true;
  }

  private setState(nextState: GameState) {
    const lastState = this.state;
    if (this.transitionState(nextState)) {
      this.exitState(lastState);
      this.enterState(this.state);

      console.log('[Game State] ::::', this.state);

      const stateUpdatedEventArgs: StateUpdatedEventArgs<GameState> = {
        last: lastState,
        current: this.state as GameState,
        target: this,
      }

      this.eventEmitter.emit(StateChangeEvent.Updated, stateUpdatedEventArgs);
    }
  }

}
