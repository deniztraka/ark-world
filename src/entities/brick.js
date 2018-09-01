export class Brick extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y);

        this.setTexture('block');
        this.setPosition(x, y);
        this.setOrigin(0.5,0.75);
        //this.depth = y;
        this.alpha = 1;

        scene.add.existing(this);
    }
}