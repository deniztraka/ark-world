export class Player extends Phaser.GameObjects.Sprite {
    constructor(_phaserScene, x, y, texture) {
        super(_phaserScene, x, y, texture);



        this.scene.add.displayList.add(this);

        //eyes.moveTo(100, 100);
    }
}