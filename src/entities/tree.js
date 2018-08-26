export class Tree extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y);

        this.setTexture('tree');
        this.setPosition(x, y);
        this.setOrigin(0.5, 1);
        this.depth = y;

        scene.add.existing(this);
    }
}