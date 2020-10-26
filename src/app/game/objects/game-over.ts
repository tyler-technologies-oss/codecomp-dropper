import { GameObjects, Scene, Math, Scale, Animations, Types } from 'phaser';
import { MonsterType } from './interfaces';
import { Monster, MonstersAtlas } from './monster';

enum VictoryAnim {
  BroomSweepMove = 'broom_sweep_move',
  BroomSweepIdle = 'broom_sweep_idle',
  BroomResting = 'broom_resting',
}

enum GameEndState {
  SweepMove = 'sweep_move',
  SweepIdle = 'sweep_idle',
  SweepResting = 'sweep_resting',
}

export function createVictoryAnimFrames(
  anims: Animations.AnimationManager, 
  monster: MonsterType
) {
  const start = 0;
  const zeroPad = 3;
  const suffix = '.png';
  const animFrameMap: Record<string, Types.Animations.AnimationFrame[]> = {
    [VictoryAnim.BroomSweepIdle]: anims.generateFrameNames(
      MonstersAtlas,
      { 
        prefix: `${monster}/walk/Walk_`,
        end: 11,
        start,
        zeroPad,
        suffix
      }
    ),
    [VictoryAnim.BroomSweepMove]: anims.generateFrameNames(
      MonstersAtlas,
      { 
        prefix: `${monster}/broom-sweep-move/BroomSweepMove_`,
        end: 1,
        start,
        zeroPad,
        suffix
      }
    ),
    [VictoryAnim.BroomResting]: anims.generateFrameNames(
      MonstersAtlas,
      { 
        prefix: `${monster}/broom-resting/BroomResting_`,
        end: 1,
        start,
        zeroPad,
        suffix
      }
    ),
  };

  anims.create({
    key: `${monster}_${VictoryAnim.BroomSweepIdle}`,
    frames: animFrameMap[VictoryAnim.BroomSweepIdle],
    frameRate: 15,
    repeat: -1
  });
  anims.create({
    key: `${monster}_${VictoryAnim.BroomSweepMove}`,
    frames: animFrameMap[VictoryAnim.BroomSweepMove],
    frameRate: 15,
  });
  anims.create({
    key: `${monster}_${VictoryAnim.BroomResting}`,
    frames: animFrameMap[VictoryAnim.BroomResting],
    frameRate: 15,
  });
}

enum DefeatAnim {
  DeadSweepIdle = 'dead_sweep_idle',
  DeadSweepMove = 'dead_sweep_move',
  DeadResting = 'dead_resting',
}

export function createDefeatAnimFrames(
  anims: Animations.AnimationManager, 
  monster: MonsterType
) {
  const start = 0;
  const zeroPad = 3;
  const suffix = '.png';
  const animFrameMap: Record<string, Types.Animations.AnimationFrame[]> = {
    [DefeatAnim.DeadSweepIdle]: anims.generateFrameNames(
      MonstersAtlas,
      { 
        prefix: `${monster}/dead-sweep-idle/DeadSweepIdle_`,
        end: 1,
        start,
        zeroPad,
        suffix
      }
    ),
    [DefeatAnim.DeadSweepMove]: anims.generateFrameNames(
      MonstersAtlas,
      { 
        prefix: `${monster}/dead-sweep-move/DeadSweepMove_`,
        end: 1,
        start,
        zeroPad,
        suffix
      }
    ),
    [DefeatAnim.DeadResting]: anims.generateFrameNames(
      MonstersAtlas,
      { 
        prefix: `${monster}/dead-resting/DeadResting_`,
        end: 1,
        start,
        zeroPad,
        suffix
      }
    ),
  };

  anims.create({
    key: `${monster}_${DefeatAnim.DeadSweepIdle}`,
    frames: animFrameMap[DefeatAnim.DeadSweepIdle],
    frameRate: 15,
  });
  anims.create({
    key: `${monster}_${DefeatAnim.DeadSweepMove}`,
    frames: animFrameMap[DefeatAnim.DeadSweepMove],
    frameRate: 15,
  });
  anims.create({
    key: `${monster}_${DefeatAnim.DeadResting}`,
    frames: animFrameMap[DefeatAnim.DeadResting],
    frameRate: 15,
  });
}

export function createAllGameEndAnimFrames(anims: Animations.AnimationManager) {
  Object.values(MonsterType).forEach(monster => {
    createVictoryAnimFrames(anims, monster);
    createDefeatAnimFrames(anims, monster);
  });
}

export class GameOver extends GameObjects.Container {
  victoryMonster: GameObjects.Sprite;
  defeatMonster: GameObjects.Sprite;
  private victoryMonsterType: MonsterType;
  private defeatMonsterType: MonsterType;

  victoryTime = 0;

  constructor(scene: Scene) {
    super(scene);

    scene.add.existing(this);

    this.setVisible(false);
  }

  initialize(victoryMonsterType: MonsterType, defeatMonsterType: MonsterType) {

    // Title
    // move victory monster walking and pushing broom
    // move defeat monster knocked out and sliding on ground
    // make background
    this.victoryMonsterType = victoryMonsterType;
    this.victoryMonster = new GameObjects.Sprite(
      this.scene, 
      600, 
      600, 
      MonstersAtlas, 
      `${victoryMonsterType}/walk/Walk_000.png`,
    );

    this.victoryMonster.flipX = true;
    this.victoryMonster.state = GameEndState.SweepIdle;

    this.defeatMonsterType = defeatMonsterType;
    this.defeatMonster = new GameObjects.Sprite(
      this.scene,
      1000,
      620,
      MonstersAtlas,
      `${defeatMonsterType}/dead-sweep-idle/DeadSweepIdle_000.png`,
    );
    this.defeatMonster.state = GameEndState.SweepIdle;

    this.add(this.victoryMonster);
    this.add(this.defeatMonster);
    this.setVisible(true);
  }

  play() {
    console.log('Play Game End Scene');
    this.scene.anims.play(`${this.victoryMonsterType}_${VictoryAnim.BroomSweepIdle}`, this.victoryMonster);
    this.scene.anims.play(`${this.defeatMonsterType}_${DefeatAnim.DeadSweepIdle}`, this.defeatMonster);
  }

  // update(time: number, dt: number): void {
  //   console.log('update', dt);
  //   this.updateState(dt);
  // }

  // private updateState() {
  //   switch (this.victoryMonster.state) {
  //     case GameEndState.SweepMove: {
  //       this.victoryTime += dt;
  //       const normalizedTime = Math.Clamp(this.victoryTime / 2000, 0, 1);
  //       const x = Math.Interpolation.Linear([600, 1000], normalizedTime);
  //       this.victoryMonster.setPosition(x, 600);
  //       this.defeatMonster.setPosition(x + 400, 620);
  //       return;
  //     }
  //     case GameEndState.SweepIdle: {
  //       this.victoryTime += dt;
  //       const normalizedTime = Math.Clamp(this.victoryTime / 2000, 0, 1);
  //       const x = Math.Interpolation.Linear([600, 1000], normalizedTime);
  //       this.victoryMonster.setPosition(x, 600);
  //       this.defeatMonster.setPosition(x + 400, 620);
  //       return;
  //     }
  //   }
  // }

  update(dt: number) {

  }

  hide() {
    this.setVisible(false);
    if (this.victoryMonster !== undefined) {
      this.remove(this.victoryMonster);
      this.victoryMonster.destroy();
    }

    if (this.defeatMonster !== undefined) {
      this.remove(this.defeatMonster);
      this.defeatMonster.destroy();
    }
  }
}
8