export class Mountain extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y);

        this.setTexture('mountains');
        this.setPosition(x, y);
        this.setOrigin(0, 0.5);
        this.depth = y;

        scene.add.existing(this);
    }
}