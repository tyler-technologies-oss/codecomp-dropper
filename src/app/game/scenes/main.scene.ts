import { Scene } from 'phaser';
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
    const monster = new Monster(this, 300, 300, MonsterType.Bobo);
    monster.scale = 0.25;
    this.add.existing(monster);
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
