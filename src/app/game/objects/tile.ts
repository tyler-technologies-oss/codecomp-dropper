import { GameObjects, Scene, Geom } from 'phaser';
import { ILocation, INeighbor, IVisitor } from './interfaces';


export enum TileColor {
  Red = 0xff0000,
  Green = 0x00ff00,
  Blue = 0x0000ff,
  Yellow = 0xffff00,
  Black = 0x000000,
  White = 0xffffff,
}


export enum TileState {
  Good = 3,
  Warning = 2,
  Danger = 1,
  Broken = 0,
}

export class Tile extends GameObjects.Rectangle implements ILocation {
  state: TileState = TileState.Good;
  visitors: IVisitor[] = [];

  neighbor: INeighbor;

  constructor(scene: Scene, x: number, y: number, width: number, height: number, color: TileColor) {
    super(scene, x, y, width, height, color);
    this.setStrokeStyle(5, TileColor.Black);

    this.setState(TileState.Good, false);
  }

  private tweenColor(color: TileColor, alpha = 1) {
    // TODO setup a tween here
    this.setFillStyle(color, alpha);
  }

  private setColor(color: TileColor, alpha = 1) {
    this.setFillStyle(color, alpha);
  }

  getPosition(): [number, number] {
    const rect = this.geom as Geom.Rectangle;
    return [this.x + rect.centerX, this.y + rect.centerY];
  }
  
  exitVisitor(visitor: IVisitor){
      this.visitors.splice(this.visitors.indexOf(visitor),1)
  }

  acceptVisitor(visitor: IVisitor): boolean {
    this.visitors.push(visitor);
    console.log(this.visitors.toString());
    let nextState = TileState.Broken;
    switch(this.state) {
      case TileState.Good:
        nextState = TileState.Warning;
        break;
      case TileState.Warning:
        nextState = TileState.Danger;
        break;
      case TileState.Danger:
      default:
        nextState = TileState.Broken;
        break;
    }

    if (nextState != this.state) {
      this.setState(nextState);
    }

    if(this.state === TileState.Broken){
        this.visitors.forEach(visitor => {
            visitor.die(this);
        });
    }

    return nextState != TileState.Broken;
  }

  setState(state: TileState, tween = true): this {
    super.setState(state);

    const setColorFn = tween ? this.tweenColor.bind(this) : this.setColor.bind(this);

    switch (state) {
      case TileState.Good:
        setColorFn(TileColor.Green);
        break;
      case TileState.Warning:
        setColorFn(TileColor.Yellow);
        break;
      case TileState.Danger:
        setColorFn(TileColor.Red);
        break;
      case TileState.Broken:
        setColorFn(TileColor.Black, 0.1);
        break;
    }

    return this;
  }
}
