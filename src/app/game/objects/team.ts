import { GameObjects, Scene, Events } from 'phaser';
import { ILocation, ITeamConfig, ITeamMemberState, MoveSet, Side, StateChangeEvent, StateUpdatedEventArgs } from './interfaces';
import { Monster, MonsterState } from './monster';

export enum TeamState {
  Error = 'error',
  Initializing = 'initializing',
  Thinking = 'thinking',
  Updating = 'updating',
  Win = 'win',
  Dead = 'dead',
}

export class Team extends GameObjects.Group {
  private _currentSide: Side;
  get currentSide() { return this._currentSide; }

  private _state: TeamState;
  get state() { return this._state };

  private eventEmitter = new Events.EventEmitter();

  get count(): number {
    return this.countActive(true);
  }

  get locations(): ILocation[] {
    return this.getChildren()
      .map((monster: Monster) => monster.location);
  }

  constructor(scene: Scene, private config: ITeamConfig) {
    super(scene);
    scene.add.existing(this);
    this.runChildUpdate = true;
    this.maxSize = 3;

    this.name = this.config.name;

    this.setState(TeamState.Initializing);
  }

  getPreferredTypes() {
    return {...this.config.preferredMonsters};
  }

  setupTeam(locations: ILocation[], side: Side) {
    this.maxSize = locations.length;
    this._currentSide = side;
    const monsterType = this.config.preferredMonsters[side];
    for(let i = 0; i < this.maxSize; i++) {
      const monster = new Monster(this.scene, 0, 0, monsterType, side);
      monster.setLocation(locations[i]);
      monster.on(StateChangeEvent.Updated, this.stateChangeHandler, this);
      this.add(monster, true);
    }

    this.setState(TeamState.Thinking);
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

  reset(locations: ILocation[], side: Side) {
    this.clearTeam();
    this.setupTeam(locations, side);
  }

  clearTeam() {
    // remove event handlers to prevent memory leak
    this.getChildren().forEach(monster => monster.removeAllListeners(StateChangeEvent.Updated));
    this.clear(true);
  }

  win() {
    this.getChildren().forEach((monster: Monster) => monster.win());
  }

  moveTeam(moves: MoveSet) {
    this.getChildren().forEach((monster: Monster, index: number) => monster.move(moves[index]));
    this.setState(TeamState.Updating);
  }

  errorTeamOut() {
    this.getChildren().forEach((monster: Monster) => monster.errorOut());
  }

  serialize(): ITeamMemberState[] {
    return this.getChildren().reduce((states, monster: Monster) => {
      const coord = monster.location.coord;
      const isDead = monster.state === MonsterState.Dead;
      states.push({coord, isDead});
      return states;
    }, [] as ITeamMemberState[])
  }

  private stateChangeHandler = function(this: Team, {current}: StateUpdatedEventArgs<MonsterState>) {
    const monsterStates = this.getChildren()
      .map((monster: Monster) => monster.state as MonsterState);

    if (monsterStates.every(state => state === MonsterState.Error)) {
      this.setState(TeamState.Error);
      return;
    }

    if (monsterStates.every(state => state === MonsterState.Dead)) {
      this.setState(TeamState.Dead);
      return;
    }

    if (monsterStates.some(state => state === MonsterState.Thinking)) {
      this.setState(TeamState.Thinking);
      return;
    }
  };

  private setState(nextState: TeamState) {
    if (this.state !== nextState) {
      const lastState = this.state;
      this._state = nextState;

      const stateUpdatedEventArgs: StateUpdatedEventArgs<TeamState> = {
        last: lastState,
        current: this.state as TeamState,
        target: this,
      }

      this.eventEmitter.emit(StateChangeEvent.Updated, stateUpdatedEventArgs);
    }
  }
}
