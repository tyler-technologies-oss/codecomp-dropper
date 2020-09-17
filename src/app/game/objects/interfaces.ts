
export interface INeighbor {
  north: ILocation | null;
  south: ILocation | null;
  east: ILocation | null;
  west: ILocation | null;
}

export interface IVisitor {
   die(location: ILocation);
}

export interface ILocation {
  neighbor: INeighbor;
  acceptVisitor(visitor: IVisitor): boolean;
  exitVisitor(visitor: IVisitor);
  getPosition():[number, number];
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

export interface ITeam {
  tileIndex: number[]
}

export interface IGameState {
  tileStates: TileState[];
  teams: ITeam[];
}

export type MoveSet = MoveDirection[];
