export default class GameGrid extends Phaser.GameObjects.Grid {
  constructor(scene: Phaser.Scene) {
    
    super(scene, 300, 100, 100, 100, 20, 20, 0xff0000);
    scene.add.existing(this);
  }
}
