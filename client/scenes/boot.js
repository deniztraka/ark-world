export class BootScene extends Phaser.Scene {
    constructor() {


        super({ key: "BootScene" });
    }

    preload() {
        this.load.image("phaserLogo", "phaser3-logo.png");

    }

    create() {
        let phaserLogo = this.add.image(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2, "phaserLogo");

        this.time.addEvent({ delay: 1000, repeat: 0, loop: false, callback: this.onLogoWaitComplete, callbackScope: this });
    }

    onLogoWaitComplete() {
        this.scene.start("PreloaderScene");
    }
}