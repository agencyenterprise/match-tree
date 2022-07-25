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
    const atlasTexture = scene.textures.get('megaset');
    const blackseed = atlasTexture.get('blackseed.png');
    const greenseed = atlasTexture.get('greenseed.png');
    const yellowseed = atlasTexture.get('yellowseed.png');
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
              .setData('cell', v);

          case 'green':
            return new Phaser.GameObjects.Sprite(
              this.scene,
              v.col * 35,
              v.row * 35,
              'megaset',
              greenseed.name
            )
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

    Phaser.Actions.GridAlign(this.getChildren(), {
      width: this.gm.boardSize,
      height: this.gm.boardSize,
      cellWidth: 80,
      cellHeight: 80,
      x: 35,
      y: 35
    });
  }
}
