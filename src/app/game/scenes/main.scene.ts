import { Scene, GameObjects } from 'phaser';
import { loadMonsterAssets, createAllMonsterAnimFrames, MonsterType, Monster } from '../objects/monster'
import { global } from '@angular/compiler/src/util';

declare module phaser {
  namespace Phaser {
    namespace GameObjects {
      interface GameObjectFactory {
        fizz: any;
      }
    }
  }
}

export class MainScene extends Scene {
  constructor() {
    super({ key: 'main' });
  }
  create() {
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
}
