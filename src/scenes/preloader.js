export class PreloaderScene extends Phaser.Scene {
    constructor() {
        super({
            key: "PreloaderScene"
        });
    }

    preload() {
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();

        this.load.on("progress", this.onProgress, this);
        this.load.on("fileprogress", this.onFileProgress);
        this.load.on("complete", this.onComplete, this);


        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect((this.scene.manager.game.renderer.width / 2) - (280 / 2), this.scene.manager.game.renderer.height / 2, 320, 20);

        var titleText = this.add.text(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2 - 15, '', {
            fontWeight: "bold",
            font: '30px Courier',
            fill: '#ffffff'
        });
        titleText.setOrigin(0.5, 0.5);
        titleText.setText(this.scene.manager.game.config.gameTitle);

        var versionText = this.add.text(titleText.x + titleText.width / 2 + 20, titleText.y + titleText.height / 2 - 8, '', {
            font: '10px Courier',
            fill: '#ffffff'
        });
        versionText.setOrigin(0.5, 0.5);
        versionText.setText(this.scene.manager.game.config.gameVersion);

        this.load.image("menuBackground", "menuBackground.png");
        this.load.image("humanBody", "mobiles/human/body.png");
        this.load.image("humanHead", "mobiles/human/head.png");
        this.load.image("humanEyes", "mobiles/human/eyes.png");
        this.load.image("humanLegs", "mobiles/human/legs.png");

        //add files from here
        // for (var i = 0; i < 500; i++) {
        //     this.load.image('phaserLogo' + i, 'phaser3-logo.png');
        // }
    }

    create() {

    }

    onProgress(value) {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect((this.scene.manager.game.renderer.width / 2) - (270 / 2), this.scene.manager.game.renderer.height / 2 + 5, 310 * value, 10);
    }

    onFileProgress(file) {
        //console.log(file.src);
    }

    onComplete() {
        this.progressBar.destroy();
        this.progressBox.destroy();
        this.scene.start("MainMenuScene");
    }
}