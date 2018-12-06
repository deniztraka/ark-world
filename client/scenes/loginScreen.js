export class LoginScreen extends Phaser.Scene {
    constructor() {
        super({
            key: "LoginScreen"
        });


    }

    preload() {

    }

    create() {
        var self = this;
        console.log("asdddd");
        var menuBackgroundImage = this.add.image(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2, "menuBackground");
        menuBackgroundImage.setOrigin(0.5, 0.5);

        //this.player = new Player(this, this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2 - 100);
        $(".btnLogin").on("click", function() {

            $(".form-signin").remove();

            self.scene.start("GameScene");
            return false;
        });
    }

    onBackClick() {
        this.scene.start("MainMenuScene");
    }

    onEnterClick() {
        this.scene.start("GameScene");
    }

    update() {}
}