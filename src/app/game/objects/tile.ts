import { GameObjects, Scene, Geom, Math as PMath, Display } from 'phaser';
import { ILocation, INeighbor, IVisitor, TileState, Coord, WorldPosition } from './interfaces';


export enum TileColor {
  Red = 0xff0000,
  Green = 0x00ff00,
  Blue = 0x0000ff,
  Yellow = 0xffff00,
  Black = 0x000000,
  White = 0xffffff,
}


export class Tile extends GameObjects.Rectangle implements ILocation {
  state: TileState = TileState.Good;
  visitors: IVisitor[] = [];

  neighbor: INeighbor;

  constructor(
    scene: Scene,
    x: number, y: number,
    width: number, height: number,
    color: TileColor,
    public readonly index: number,
    public readonly coord: Coord
  ){
    super(scene, x, y, width, height, color);
    this.setStrokeStyle(5, TileColor.Black);

    this.setState(TileState.Good, false);
    this.setAlpha(0.6);
  }

  private tweenColor(color: TileColor, alpha = 1) {
    const startColor =  Display.Color.IntegerToColor(this.fillColor);
    const endColor = Display.Color.IntegerToColor(color);
    this.scene.tweens.addCounter({
      from: 0, to: 100, duration: 300,
      ease: PMath.Easing.Sine.InOut,
      onUpdate: tween => {
        const value = tween.getValue();
        const {r,g,b} = Display.Color.Interpolate.ColorWithColor(startColor, endColor, 100, value);
        this.setFillStyle(Display.Color.GetColor(r,g,b), alpha);
      }
    })
  }

  private setColor(color: TileColor, alpha = 1) {
    this.setFillStyle(color, alpha);
  }

  getPosition(): WorldPosition {
    const rect = this.geom as Geom.Rectangle;
    return [this.x + this.parentContainer.x ,
      this.y + this.parentContainer.y ];
  }

  exitVisitor(visitor: IVisitor){
    const i = this.visitors.indexOf(visitor);
    if (i > -1) {
      this.visitors.splice(i,1)
    }
  }

  acceptVisitor(visitor: IVisitor): boolean {
    let nextState = TileState.Broken;
    switch(this.state) {
      case TileState.Good:
        nextState = TileState.Warning;
        visitor.addDecrementedTiles();
        break;
      case TileState.Warning:
        nextState = TileState.Danger;
        visitor.addDecrementedTiles();
        break;
      case TileState.Danger:
      default:
        nextState = TileState.Broken;
        visitor.addDecrementedTiles();
        break;
    }

    this.setState(nextState);

    if (this.state === TileState.Broken) {
      visitor.die();
    } else {
      this.visitors.push(visitor);
    }

    return nextState != TileState.Broken;
  }

  setState(state: TileState, tween = true): this {
    if (this.state === state) {
      return;
    }

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
        // because the act of dying removes a visitor from a tile
        // we need to create a different array to iterate against
        // to kill existing visitors
        [...this.visitors].forEach(v => v.die());
        break;
    }

    return this;
  }

  reset(state = TileState.Good) {
    this.visitors.length = 0; // clear any visitors
    this.setState(state);
  }
}
