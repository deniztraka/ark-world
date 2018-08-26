export class Brick extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y);

        this.setTexture('brick');
        this.setPosition(x, y);
        this.setOrigin(0,0.33333);
        this.depth = y;
        this.alpha = 1;

        scene.add.existing(this);
    }
}