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
        $(".form-signin").show();

        var menuBackgroundImage = this.add.image(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2, "menuBackground");
        menuBackgroundImage.setOrigin(0.5, 0.5);

        $(".btnLogin").on("click", function() {
            const socket = io(window.location.origin);
            socket.on('connect', function() {
                var clientNameInputVal = $("#inputName").val();
                socket.emit("hiFromClient", clientNameInputVal);

                socket.on("handShaked", function(status) {
                    if (status) {
                        $(".form-signin").hide();
                        self.scene.start("MainMenuScene", {
                            socket: socket
                        });
                    }

                })
            });

            return false;
        });
    }

    update() {}
}