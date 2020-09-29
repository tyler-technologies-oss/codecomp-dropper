import { GameObjects, Scene, Events } from 'phaser';
import { createSandboxAsync, ISandbox } from 'src/app/helpers';
import { IGameState, ILocation, ITeamConfig, ITeamMemberState, MoveSet, Side, StateChangeEvent, StateUpdatedEventArgs } from './interfaces';
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

  private sandbox: ISandbox<MoveSet> = null;

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

  async setupTeam(locations: ILocation[], side: Side) {
    if(!this.sandbox) {
      try {
        this.sandbox = await createSandboxAsync<MoveSet>(this.name, this.config.aiSrc);
      } catch (err) {
        this.setState(TeamState.Error);
      }
    }

    this.maxSize = locations.length;
    this._currentSide = side;
    const monsterType = this.config.preferredMonsters[side];
    for(let i = 0; i < this.maxSize; i++) {
      const monster = new Monster(this.scene, 0, 0, monsterType, side);
      monster.setLocation(locations[i]);
      monster.on(StateChangeEvent.Updated, this.stateChangeHandler, this);
      this.add(monster, true);
      if (this.state === TeamState.Error) {
        // randomly stagger the dying in the event the ai fails to compile
        setTimeout(() => monster.errorOut(), Math.floor(Math.random() * 700));
      }
    }

    this.setState(TeamState.Thinking);
  }

  getNextMovesAsync(gameState: IGameState, timeout?: number) {
    return this.sandbox.evalAsync([gameState, this.currentSide], timeout);
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

  reset() {
    this.clearTeam();
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

  private transitionState(nextState: TeamState) {
    if (this.state === TeamState.Dead ||
        this.state === TeamState.Error ||
        this.state === TeamState.Win) {
          return false;
    }

    this._state = nextState;
    return true;
  }

  private setState(nextState: TeamState) {
    const lastState = this.state;
    if (this.state !== nextState && this.transitionState(nextState)) {
      const stateUpdatedEventArgs: StateUpdatedEventArgs<TeamState> = {
        last: lastState,
        current: this.state as TeamState,
        target: this,
      }

      this.eventEmitter.emit(StateChangeEvent.Updated, stateUpdatedEventArgs);
    }
  }
}
