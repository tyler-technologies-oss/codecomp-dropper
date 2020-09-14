import { Scene, Math } from 'phaser';
import { loadMonsterAssets, createAllMonsterAnimFrames, MonsterType, Monster } from '../objects/monster'
import { Tile } from '../objects/tile';


//TODO: Pull in a library? Figure out if phaser has these built in
const RED = 0xff0000;
const GREEN = 0x00ff00;
const BLUE = 0x0000ff;
const BLACK = 0x000000;
const WHITE = 0xffffff;
const COLORMAP = {
  1:RED,
  2:BLUE,
  3:GREEN
}

export class MainScene extends Scene {

  rows:number = 5;
  columns:number = 5;
  grid: Array<Array<Tile>> = new Array<Array<Tile>>();

  constructor() {
    super({ key: 'main' });
  }
  create() {
    this.initializeGrid(3);
    this.drawGrid(50);

    createAllMonsterAnimFrames(this.anims);
    const bobo = new Monster(this, 300, 200, MonsterType.Bobo);
    bobo.scale = 0.25;
    bobo.flipX = Boolean(Math.Between(0, 1));
    this.add.existing(bobo);

    const goldy = new Monster(this, 200, 200, MonsterType.Goldy);
    goldy.scale = 0.25;
    goldy.flipX = Boolean(Math.Between(0, 1));
    this.add.existing(goldy);

    const grouchy = new Monster(this, 400, 200, MonsterType.Grouchy);
    grouchy.scale = 0.25;
    grouchy.flipX = Boolean(Math.Between(0, 1));
    this.add.existing(grouchy);

    const pinky = new Monster(this, 300, 400, MonsterType.Pinky);
    pinky.scale = 0.25;
    pinky.flipX = Boolean(Math.Between(0, 1));
    this.add.existing(pinky);

    const spike = new Monster(this, 200, 400, MonsterType.Spike);
    spike.scale = 0.25;
    spike.flipX = Boolean(Math.Between(0, 1));
    this.add.existing(spike);

    const triclops = new Monster(this, 400, 400, MonsterType.Triclops);
    triclops.scale = 0.25;
    triclops.flipX = Boolean(Math.Between(0, 1));
    this.add.existing(triclops);
  }
  preload() {
    loadMonsterAssets(this);
  }
  update() {
    // console.log('update method');
  }

  initializeGrid(initialSteps:number){
    this.grid.push()
    for(let i = 0; i < this.rows; i++){
      let row = new Array<Tile>();
      for(let j = 0; j < this.columns; j++){
        let tile = new Tile(initialSteps);
        row.push(tile);
      }
      this.grid.push(row);
    }
  }

  drawGrid(baseOffset:number){

    let drawableWidth = this.scale.width - (baseOffset * 2);
    let drawableHeight = this.scale.height - (baseOffset * 2);
    let squareSize = 1;
    if(drawableWidth > drawableHeight){
      squareSize = drawableHeight / this.columns;
    }else{
      squareSize = drawableWidth / this.rows;
    }

    for(let i = 0; i < this.columns; i++){
      for(let j = 0; j < this.rows; j++){
        let rectangle = this.add.graphics({ lineStyle: { color: BLACK, width: 5}, fillStyle: {color: this.getColor(this.grid[i][j])} });
        console.log(baseOffset + (i * squareSize));
        rectangle.clear().strokeRect(baseOffset + i * squareSize, baseOffset + j * squareSize, squareSize, squareSize);
        rectangle.fillRect(baseOffset + i * squareSize, baseOffset + j * squareSize, squareSize, squareSize)
      }
    }
  }

  getColor(tile:Tile){
    return COLORMAP[tile.getStepsRemaining()];
  }
}
