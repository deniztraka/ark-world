export class PvpInitializingScene extends Phaser.Scene {
    constructor() {
        super({
            key: "PvpInitializingScene"
        });
        
    }

    init(obj) {
        var self = this;
        this.io = obj.io;
        this.socket = obj.socket;
        
        var self = this;
        this.socket.on("onWorldReady", function(staticMapData) {
            
            self.onWorldInitialized(staticMapData);
        });

        this.socket.on("disconnect", function() {
            self.scene.start("LoginScreen");
        });
    }

    preload() {

    }

    create() {
        var titleText = this.add.text(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2 - 15, '', {
            fontWeight: "bold",
            font: '30px Courier',
            fill: '#ffffff'
        });
        titleText.setOrigin(0.5, 0.5);
        titleText.setText("Fight Incoming!");
    }

    

    update() {

    }

    onWorldInitialized(staticMapData) {
        console.log(staticMapData);
        if (staticMapData) {
            this.scene.start("GameScene", {
                socket: this.socket,
                staticMapData: staticMapData
            });
        }


    }
}