import { Scene, Math, GameObjects } from 'phaser';
import { loadMonsterAssets, createAllMonsterAnimFrames, MonsterType, Monster } from '../objects/monster'
import { TileGrid } from '../objects/grid';


export class MainScene extends Scene {

  constructor() {
    super({ key: 'main' });
  }

  create() {

    const updateGroup = this.add.group([], {runChildUpdate: true});
    createAllMonsterAnimFrames(this.anims);

    const baseOffset = 50;
    const tileGrid = new TileGrid(this, baseOffset, baseOffset, this.scale.width - (baseOffset * 2), this.scale.height - (baseOffset * 2), 5);

    const bobo = new Monster(this, 0, 0, MonsterType.Bobo);
    const startingTile = tileGrid.getTileAtIndex(1, 1);
    bobo.setLocation(startingTile);

    updateGroup.add(bobo);
  }

  preload() {
    loadMonsterAssets(this);
  }

  update(time: number, dt:number) {
    // console.log('update method');
    super.update(time, dt);
  }
}
