import Phaser from 'phaser';
import GameGrid from '../grid/Grid';

interface Square {
  type: 'apple' | 'cherry' | 'peach';
}

const square = 10;

export default class Demo extends Phaser.Scene {
  activeSprite: Phaser.GameObjects.Sprite[] = [];
  gameGrid!: GameGrid;
  constructor() {
    super('GameScene');
  }

  preload() {
    this.load.setPath('assets/assetpack/');
    this.load.atlas('megaset', ['texture.png'], 'texture.json');
    // this.gameGrid = new GameGrid(this)
  }
  update(time: number, delta: number): void {
    // this.gameGrid.update();
  }
  createBackground() {
    const atlasTexture = this.textures.get('megaset');

    const frame = atlasTexture.get('background.png');

    let scale = 1;
    // this.game.scale.setGameSize(2, 2);
    // if (this.game.scale.width > frame.height) {
    //   scale = this.game.scale.width / frame.width;
    // }
    // console.log(this.game.scale.width, frame.width, scale);
    // console.log(this.game.scale)
    const background = new Phaser.GameObjects.Image(
      this,
      window.innerWidth / 2,
      window.innerHeight / 2,
      'megaset',
      frame.name
    );

    const scaleX = (window.innerWidth / background.width);
    const scaleY = (window.innerHeight / background.height);
    scale = Math.max(scaleX, scaleY);
    background.setScale(scale);
    this.add.existing(background);

    // this.scale.displaySize.height
    // this. scale.displaySize.width;
  }

  create() {
    this.createBackground();
    this.add.existing(new GameGrid(this));

    //  img.height
    //  background.add()
  }
}
