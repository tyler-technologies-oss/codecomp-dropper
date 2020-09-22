import { Scene, Math, Input } from 'phaser';
import { loadMonsterAssets, createAllMonsterAnimFrames} from '../objects/monster'
import { TileGrid } from '../objects/grid';
import { ILocation, INeighbor, ITeamConfig, MonsterType, MoveDirection, Side, StateChangeEvent, StateUpdatedEventArgs, TileState } from '../objects/interfaces';
import { Team, TeamState } from '../objects/team';




function randomMove(neighbors: INeighbor): MoveDirection {
  const moves = Object.entries(neighbors)
    .filter(kvp => kvp[1] != null)
    .map(kvp => kvp[0] as MoveDirection)
    .reduce((moveSet: MoveDirection[], direction: MoveDirection) => {
      moveSet.push(direction);
      return moveSet;
    }, [MoveDirection.None]);

  return moves[Math.Between(0, moves.length - 1)];
}

function moveTeamRandom(locations: ILocation[]): MoveDirection[] {
  return locations.map(location => randomMove(location.neighbor));
}

function tripleCrash(locations: ILocation[]): MoveDirection[] {
  return [MoveDirection.East, MoveDirection.West, MoveDirection.North];
}

function getTeamMoveSet(locations: ILocation[]): MoveDirection[] {
  return moveTeamRandom(locations);
  // return tripleCrash(locations);
}
function textureWidth(name: string, scene: Scene): number {
  const tex = scene.textures.get(name);
  const imageData = tex.get(0).width;
  return imageData;
}

function textureHeight(name: string, scene: Scene): number {
  const tex = scene.textures.get(name);
  const imageData = tex.get(0).height;
  return imageData;
}

function createBackgroundTile(scene: Scene, name: string): Phaser.GameObjects.TileSprite {
  return scene.add.tileSprite(
      textureWidth(name, scene) * (scene.scale.width) / textureWidth(name, scene) / 2,
      textureHeight(name, scene) * (scene.scale.height) / textureHeight(name, scene) / 2,
      scene.scale.width, scene.scale.height,
      name).setTileScale((scene.scale.height) / textureHeight(name, scene),
      (scene.scale.height) / textureHeight(name, scene));

}

export class MainScene extends Scene {

  grid: TileGrid;
  homeTeam: Team;
  awayTeam: Team;
  thinkingTime = 0;
  maxThinkingTime = 2000;
  gameOver = false;
  backgroundTileSprites: Phaser.GameObjects.TileSprite[] = [];

  constructor() {
    super({ key: 'main' });
  }

  create() {
    this.backgroundTileSprites.push(createBackgroundTile(this, '1'));
    this.backgroundTileSprites.push(createBackgroundTile(this, '2'));
    this.backgroundTileSprites.push(createBackgroundTile(this, '3'));
    this.backgroundTileSprites.push(createBackgroundTile(this, '4'));
    this.backgroundTileSprites.push(createBackgroundTile(this, '5'));
    this.backgroundTileSprites.push(createBackgroundTile(this, '6'));

    createAllMonsterAnimFrames(this.anims);

    // todo try to add dynamic scaling
    const boardSize = this.scale.height - 100;
    const x = (this.scale.width - boardSize) / 2;
    const y = (this.scale.height - boardSize) / 2;

    const tileGrid = new TileGrid(this, x, y, boardSize, boardSize, 5);
    this.grid = tileGrid;

    const homeTeamConfig: ITeamConfig = {
      name: 'Home Team',
      preferredMonsters: {
        [Side.Home]: MonsterType.Bobo,
        [Side.Away]: MonsterType.Triclops,
      }
    }
    const homeTeam = new Team(this, homeTeamConfig);
    const homeStartLocations: ILocation[] = [
      tileGrid.getTileAtIndex(0, 0),
      tileGrid.getTileAtIndex(0, 2),
      tileGrid.getTileAtIndex(0, 4),
    ]
    homeTeam.setupTeam(homeStartLocations, Side.Home);
    this.homeTeam = homeTeam;

    const awayTeamConfig: ITeamConfig = {
      name: 'Home Team',
      preferredMonsters: {
        [Side.Home]: MonsterType.Bobo,
        [Side.Away]: MonsterType.Triclops,
      }
    }
    const awayTeam = new Team(this, awayTeamConfig);
    const awayStartLocations: ILocation[] = [
      tileGrid.getTileAtIndex(4, 0),
      tileGrid.getTileAtIndex(4, 2),
      tileGrid.getTileAtIndex(4, 4),
    ]
    awayTeam.setupTeam(awayStartLocations, Side.Away);
    this.awayTeam = awayTeam;

    const reset = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.R);
    reset.on(Input.Keyboard.Events.UP, function (this: MainScene) {
      this.grid.reset();
      this.homeTeam.reset(homeStartLocations, Side.Home);
      this.awayTeam.reset(awayStartLocations, Side.Away);
      this.gameOver = false;
    }, this);
    console.log(`Press 'R' to reset!`);
  }

  preload() {
    loadMonsterAssets(this);
    this.load.image('1', 'assets/background/Halloween/1.png');
    this.load.image('2', 'assets/background/Halloween/2.png');
    this.load.image('3', 'assets/background/Halloween/3.png');
    this.load.image('4', 'assets/background/Halloween/4.png');
    this.load.image('5', 'assets/background/Halloween/5.png');
    this.load.image('6', 'assets/background/Halloween/6.png');
    this.load.image('7', 'assets/background/Halloween/7.png');
    this.load.image('8', 'assets/background/Halloween/8.png');
    this.load.image('9', 'assets/background/Halloween/9.png');
  }

  update(time: number, dt: number) {
    this.backgroundTileSprites[1].tilePositionX -= 0.2;

    if (!this.gameOver) {
      if (this.homeTeam.state === TeamState.Thinking &&
        (this.awayTeam.state === TeamState.Dead || this.awayTeam.state === TeamState.Error)) {
        this.homeTeam.win();
        console.log('[Game Over] Home Team Wins!');
        this.gameOver = true;
        return;
      }

      if (this.awayTeam.state === TeamState.Thinking &&
        (this.homeTeam.state === TeamState.Dead || this.homeTeam.state === TeamState.Error)) {
        this.awayTeam.win();
        console.log('[Game Over] Away Team Wins!');
        this.gameOver = true;
        return;
      }

      if ((this.homeTeam.state === TeamState.Dead || this.homeTeam.state === TeamState.Error) &&
        (this.awayTeam.state === TeamState.Dead || this.awayTeam.state === TeamState.Error)) {
        console.log('[Game Over] DRAW');
        this.gameOver = true;
      }

      if (this.homeTeam.state === TeamState.Thinking && this.awayTeam.state === TeamState.Thinking) {
        this.thinkingTime += dt;
        if (this.thinkingTime >= this.maxThinkingTime) {
          this.thinkingTime = 0;
          let moveSet = getTeamMoveSet(this.homeTeam.locations);
          this.homeTeam.moveTeam(moveSet);
          moveSet = getTeamMoveSet(this.awayTeam.locations);
          this.awayTeam.moveTeam(moveSet);
        }
      }
    }
  }
}
