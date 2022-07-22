import Phaser from 'phaser';

export default class Fruit extends Phaser.GameObjects.Sprite {
    constructor (config: {scene: Phaser.Scene, x: number, y:number, key:string}) {
        super(config.scene, config.x, config.y , config.key);
        this.scene = config.scene;
        this.scene.add.existing(this);
      }
    

}
