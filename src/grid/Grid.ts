import _ from 'lodash';
import { GameManager } from '../controller/GameManager';
import { ISeed } from '../controller/interfaces';

export default class GameGrid extends Phaser.GameObjects.Group {
  gm = new GameManager({ boardSize: 6 });
  selected: {
    first?: { seed: ISeed; sprite: Phaser.GameObjects.Sprite };
    second?: { seed: ISeed; sprite: Phaser.GameObjects.Sprite };
  } = {};
  constructor(scene: Phaser.Scene) {
    super(scene);

    // const magicPadding = magicWidth * 2

    const atlasTexture = scene.textures.get('megaset');
    const blackseed = atlasTexture.get('blackseed.png');
    const greenseed = atlasTexture.get('greenseed.png');
    const yellowseed = atlasTexture.get('yellowseed.png');

    const isMobile = scene.game.canvas.width < scene.game.canvas.height;

    const magicWidth = isMobile
      ? ((scene.game.canvas.height / scene.game.canvas.width) *
          blackseed.width) /
        256
      : ((scene.game.canvas.height / scene.game.canvas.width) *
          blackseed.width) /
        50;

    console.log(scene.scale, scene.game.scale, this.scaleX, this.scaleY);
    const mapSeeds = this.gm.seeds.map((e) => {
      return e.map((v) => {
        switch (v.type) {
          case 'black':
            return new Phaser.GameObjects.Sprite(
              this.scene,
              v.col * 35,
              v.row * 35,
              'megaset',
              blackseed.name
            )

              .setInteractive()
              .setScale(1 / magicWidth, 1 / magicWidth)
              .setData('cell', v);

          case 'green':
            return new Phaser.GameObjects.Sprite(
              this.scene,
              v.col * 35,
              v.row * 35,
              'megaset',
              greenseed.name
            )
              .setScale(1 / magicWidth, 1 / magicWidth)
              .setInteractive()
              .setData('cell', v);
          case 'corn':
            return new Phaser.GameObjects.Sprite(
              this.scene,
              v.col * 35,
              v.row * 35,
              'megaset',
              yellowseed.name
            )
              .setScale(1 / magicWidth, 1 / magicWidth)
              .setInteractive()
              .setData('cell', v);
          default:
            return new Phaser.GameObjects.Sprite(
              this.scene,
              v.col * 35,
              v.row * 35,
              'megaset',
              yellowseed.name
            )
              .setInteractive()
              .setScale(magicWidth, magicWidth)
              .setData('cell', v);
        }
      });
    });

    const sprites = _.flatten(mapSeeds);
    sprites.forEach((e) =>
      e.addListener('pointerdown', () => {
        e.setTint(0x999999);

        if (!this.selected.first) {
          this.selected.first = { seed: e.getData('cell'), sprite: e };
        } else {
          this.selected.second = { seed: e.getData('cell'), sprite: e };
        }

        if (this.selected.first && this.selected.second) {
          this.selected.first.sprite.setTint(undefined);
          this.selected.second.sprite.setTint(undefined);
          this.selected = {};
        }
      })
    );
    this.addMultiple(sprites, true);

    console.log('scale', magicWidth);
    Phaser.Actions.GridAlign(this.getChildren(), {
      width: 6, //this.gm.boardSize,
      height: 6, //this.gm.boardSize,
      cellWidth: blackseed.realWidth / magicWidth,
      cellHeight: blackseed.realWidth / magicWidth,
      x: 100,
      y: 100
    });
  }
}
// const scaleHeight = scene.game.canvas.height / scene.game.canvas.width
// Phaser.Actions.GridAlign(this.getChildren(), {
//   width: 600, //this.gm.boardSize / scaleHeight,
//   height: 600, //this.gm.boardSize / scaleHeight,
//   cellWidth: 100, //magicWidth,
//   cellHeight: 100, //scene.game.canvas.height / 12,
//   x: 100, //magicWidth,
//   y: 100, //scene.game.canvas.height / 12
