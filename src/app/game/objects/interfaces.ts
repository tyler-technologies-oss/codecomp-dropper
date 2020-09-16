
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
