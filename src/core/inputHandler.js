export class InputHandler {
    constructor(_phaserScene) {
        this.phaserScene = _phaserScene;
        this.keys = {};

        this.keys.right = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keys.d = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        this.keys.left = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keys.a = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        this.keys.up = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keys.w = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        this.keys.down = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keys.s = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }

    update() {}

}