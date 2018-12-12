import io from 'socket.io-client';
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

        var menuBackgroundImage = this.add.image(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2, "menuBackground");
        menuBackgroundImage.setOrigin(0.5, 0.5);

        $(".btnLogin").on("click", function() {


            const socket = io(window.location.origin);
            socket.on('connect', function() {

                socket.emit("hiFrom", $("#inputName").val());

                socket.on("staticWorldData", function(data) {
                    $(".form-signin").remove();
                    self.scene.start("GameScene", data);
                })
            });

            return false;
        });
    }

    update() {}
}