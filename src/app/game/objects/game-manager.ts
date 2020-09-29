import { Events, Game } from 'phaser';
import { TileGrid } from './grid';
import { IGameState, ILocation, MoveDirection, MoveSet, Side, StateChangeEvent, StateUpdatedEventArgs, TeamStates } from './interfaces';
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

  private stateChangeHandler = function(this: GameManager, {current}: StateUpdatedEventArgs<TeamState>) {
    const teamStates = Object.values(this.teams).map(team => team.state);

    if (teamStates.every(state => state === TeamState.Error)) {
      this.setState(GameState.Draw);
      return;
    }

    if (teamStates.every(state => state === TeamState.Dead)) {
      this.setState(GameState.Draw);
      return;
    }

    if (teamStates.every(state => state === TeamState.Thinking)) {
      this.setState(GameState.Thinking);
      return;
    }
  }

  private async initialize() {
    if (this.teams) {
      // clear any handlers on existing teams
      Object.values(this.teams).forEach(team => team.removeAllListeners(StateChangeEvent.Updated));
    }

    this.setState(GameState.Initializing);
    const {teams, grid, startLocations} = this.matchConfig;
    this.teams = teams;
    // register for team events
    Object.values(teams).forEach(team => team.on(StateChangeEvent.Updated, this.stateChangeHandler, this));
    this.grid = grid;

    // wait for all scripts to load
    const promises = [
      this.teams[Side.Home].setupTeam(startLocations[Side.Home], Side.Home),
      this.teams[Side.Away].setupTeam(startLocations[Side.Away], Side.Away),
    ];

    await Promise.allSettled(promises);

    const homeTeamReady = this.teams[Side.Home].state !== TeamState.Error;
    const awayTeamReady = this.teams[Side.Away].state !== TeamState.Error;

    if(homeTeamReady && awayTeamReady) {
      // this.setState(GameState.Thinking);
    } else if (!homeTeamReady && !awayTeamReady) {
      this.setState(GameState.Draw);
    } else if (homeTeamReady && !awayTeamReady) {
      this.setState(GameState.HomeTeamWins);
    } else {
      this.setState(GameState.AwayTeamWins);
    }
  }

  private async updateMoves() {
    const serializedGameState: IGameState = {
      boardSize: [this.grid.size, this.grid.size],
      tileStates: this.grid.serialize(),
      teamStates: this.sides.reduce((states: TeamStates, side) => {
        states[side] = this.teams[side].serialize();
        return states;
      }, {} as TeamStates)
    };

    const home = this.teams[Side.Home];
    const away = this.teams[Side.Away];

    const promises = [home.getNextMovesAsync(serializedGameState, this.thinkingTime), away.getNextMovesAsync(serializedGameState, this.thinkingTime)];
    const allSettled = await Promise.allSettled(promises);

    // make sure the team state didnt slip into error.
    // this occurs when there is a critical failure in the ai
    const homeOkay = home.state !== TeamState.Error;
    const awayOkay = away.state !== TeamState.Error;

    if (homeOkay && awayOkay) {
      const [homeResponse, awayResponse] = allSettled.map(result => (<any>result).value);

      // validate teh moves
      const [homeMoves, awayMoves] = [this.validateMoves(homeResponse, Side.Home), this.validateMoves(awayResponse, Side.Away)];

      console.log('homeMoves', homeMoves);
      console.log('awayMoves', awayMoves);

      // make sure the move set returned is actually a valid move
      if (homeMoves === null && awayMoves === null) {
        // neither team had valid moves
        this.setState(GameState.Draw);
      } else if(homeMoves === null && awayMoves !== null) {
        // home team did not return valid moves
        this.setState(GameState.AwayTeamWins);
      } else if(homeMoves !== null && awayMoves === null) {
        // away team did not return valid moves
        this.setState(GameState.HomeTeamWins);
      }

      // instruct teams to move
      home.moveTeam(homeMoves);
      away.moveTeam(awayMoves);

      // all moves are dispatched, time to wait for the teams
      // to say they are done animating!
      this.setState(GameState.Updating);
    } else if(!homeOkay && awayOkay) {
      // home team script critically failed
      this.setState(GameState.AwayTeamWins);
    } else if(homeOkay && !awayOkay) {
      // away team script critically failed
      this.setState(GameState.HomeTeamWins);
    } else {
      // both team scripts critically failed
      this.setState(GameState.Draw);
    }
  }

  private validateMoves(moves: any, side: Side): MoveSet | null {
    const team = this.teams[side];
    if (Array.isArray(moves)) {
      if (moves.length === team.getLength()) {
        return moves.map((move, i) => {
          if ((move !== MoveDirection.None) &&
             move !== MoveDirection.North &&
             move !== MoveDirection.South &&
             move !== MoveDirection.East &&
             move !== MoveDirection.West) {

            console.warn(`${team.name} move at index ${i} is not a valid move.`, move);
            return MoveDirection.None;
          }

          return move as MoveDirection;
        });
      } else {
        console.warn(`${team.name} did not return enough moves`);

      }
    } else {
      console.warn(`${team.name} did not return an array.`);
    }
    return null;
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
