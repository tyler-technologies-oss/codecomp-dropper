
export interface INeighbor {
  north: ILocation | null;
  south: ILocation | null;
  east: ILocation | null;
  west: ILocation | null;
}

export interface IVisitor {

}

export interface ILocation {
  neighbor: INeighbor;
  acceptVisitor(visitor: IVisitor): boolean;
  getPosition():[number, number];
}
