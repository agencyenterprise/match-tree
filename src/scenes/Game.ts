import Phaser from 'phaser';
import GameGrid from '../grid/Gird';


interface Square {
  type: "apple" | "cherry" | "peach"
}


const square = 10



export default class Demo extends Phaser.Scene {
  
  activeSprite :Phaser.GameObjects.Sprite[] =[];
  gameGrid!: GameGrid;
  constructor() {
    super('GameScene');
  }


  preload() {

    this.load.setPath('assets/assetpack/');
    this.load.atlas('megaset', [ 'texture.png' ], 'texture.json');
    // this.gameGrid = new GameGrid(this)
   
  }
  update(time: number, delta: number): void {
    // this.gameGrid.update();
    
  }
  createBackground (){
    const atlasTexture = this.textures.get('megaset');
    
    const frame = atlasTexture.get("background.png")
    const background =  this.add.layer();
    let scale =1;

    if(this.game.scale.width > frame.width){
       scale =   this.game.scale.width / frame.width
    }
    console.log(this.game.scale.width, frame.width,scale)
    const img = new Phaser.GameObjects.Image(this,frame.width/(2 / scale),frame.height/(2),"megaset", frame.name);
    img.setScale(scale,scale)
    this.add.existing(img);
   
    // this.scale.displaySize.height
    // this. scale.displaySize.width;
  }

  create() {
    this.createBackground()
  //  img.height
  //  background.add()
     
  
}
   

  
  
}
