import { GameObjects, Scene } from 'phaser';
import { TileState } from './interfaces';
import { Tile, TileColor } from './tile';

export class TileGrid extends GameObjects.Container {

  tiles: Tile[] = [];
  private readonly squareSize: number;

  constructor(scene: Scene, x: number, y: number, public readonly width: number, public readonly height: number, public readonly size: number) {
    super(scene, x, y);
    scene.add.existing(this);

    this.squareSize = width / size;
    if(width > height){
      this.squareSize = height / size;
    }

    const halfSquareSize = this.squareSize * 0.5;

    // create the tiles
    for(let i = 0; i < size * size; i++) {
      const tile = new Tile(
        scene,
        (((i % size) * this.squareSize) + halfSquareSize),
        ((Math.floor(i / size) * this.squareSize) + halfSquareSize),
        this.squareSize,
        this.squareSize,
        TileColor.Green,
        i,
        [Math.floor(i / size), i % size]
      );

      this.tiles.push(tile);
    }

    // resolve neighbors
    for(let i = 0; i < size * size; i ++) {
      const curr_x = i % size;
      const curr_y = Math.floor(i / size);

      this.tiles[i].neighbor = {
        north:  this.getTileAtIndex(curr_y-1, curr_x),
        south:  this.getTileAtIndex(curr_y+1, curr_x),
        west:   this.getTileAtIndex(curr_y, curr_x-1),
        east:   this.getTileAtIndex(curr_y, curr_x+1),
      };
    }

    this.add(this.tiles);
  }

  getTileAtIndex(row: number, column: number): Tile | null {
    const size1 = this.size - 1;
    if (row < 0 || row > size1 || column < 0 || column > size1) {
      return null;
    }

    return this.tiles[row * this.size + column] as Tile;
  }

  getTileAtPos(x: number, y: number): Tile | null {
    const relative_x = x - this.x;
    const relative_y = y - this.y;
    const width1 = this.width - 1;
    const height1 = this.height - 1;

    if (x < 0 || x > width1 || y < 0 || y > height1) {
      return null;
    }

    const column = Math.floor(relative_x / this.squareSize);
    const row = Math.floor(relative_y / this.squareSize);

    return this.tiles[row * this.size + column] as Tile;
  }

  reset() {
    this.tiles.forEach(t => t.reset());
  }

  serialize(): TileState[][] {
    const arrayLike = {length: this.size};
    const tileStates: TileState[][] =
      Array.from(arrayLike, (_, row) =>
        Array.from(arrayLike, (_, col) =>
          this.tiles[row * this.size + col].state
        )
      );

    return tileStates;
  }
}
