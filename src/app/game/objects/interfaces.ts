export enum MonsterType {
  Bobo      = 'bobo',
  Triclops  = 'triclops',
  Goldy     = 'goldy',
  Pinky     = 'pinky',
  Spike     = 'spike',
  Grouchy   = 'grouchy',
}

export type WorldPosition = [number, number];

export type Coord = [number, number];

export interface INeighbor {
  [MoveDirection.North]: ILocation | null;
  [MoveDirection.South]: ILocation | null;
  [MoveDirection.East]: ILocation | null;
  [MoveDirection.West]: ILocation | null;
}

export interface IVisitor {
  id: number;
  side: Side;
  die();
}

export interface ILocation {
  neighbor: INeighbor;
  index: number, // single dimension index of the tile within the grid
  coord: Coord, // [x, y] index of the tile within the grid
  state: TileState;
  acceptVisitor(visitor: IVisitor): boolean;
  exitVisitor(visitor: IVisitor);
  getPosition(): WorldPosition;
}

export enum Side {
  Home = 'home',
  Away = 'away',
}


export enum MoveDirection {
  North = 'north',
  South = 'south',
  East = 'east',
  West = 'west',
  None = 'none',
}

export enum TileState {
  Good = 3,
  Warning = 2,
  Danger = 1,
  Broken = 0,
}

export interface ITeamMemberState {
  coord: Coord;
  isDead: boolean;
}

export type TeamStates = Record<Side, ITeamMemberState[]>;

export interface IGameState {
  tileStates: TileState[][];
  teamStates: TeamStates;
}

export type MoveSet = MoveDirection[];

export type GetMoveSetFn = (gameState: IGameState, side: Side) => MoveSet;

export interface ITeamConfig {
  name: string;
  preferredMonsters: {
    [Side.Home]: MonsterType;
    [Side.Away]: MonsterType;
  };
  aiSrc: string;
}

export interface StateUpdatedEventArgs<State> {
  current: State;
  last: State;
  target: any;
}
``
export enum StateChangeEvent {
  Updated = 'state_updated'
}
