import {
    MainMenu
} from "../ui/mainMenu";


import {
    MenuPosition
} from "../ui/menuPosition";

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MainMenuScene"
        });
    }

    init(obj) {
        var self = this;
        this.staticMapData = obj.data;
        this.socket = obj.socket;

        this.socket.on("disconnect", function() {
            self.scene.start("LoginScreen");
        });

        this.socket.on("ServerSearchingForAnOpponent", function() {
            self.onServerSearchingForAnOpponent();
        });

        this.socket.on("MatchResult", function(result) {
            self.onMatchResult(result);
        });
    }

    preload() {

    }

    create() {
        var menuBackgroundImage = this.add.image(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2, "menuBackground");
        menuBackgroundImage.setOrigin(0.5, 0.5);

        this.mainMenu = new MainMenu(this, MenuPosition.Bottom);
        this.mainMenu.addMenuItem("Search", this.onSearchClicked, this);
        this.mainMenu.addMenuItem("Cancel", this.onSearchCancelClicked, this);
        this.mainMenu.menuItems[this.mainMenu.menuItems.length - 1].setActive(false);
        //mainMenu.addMenuItem("Create", this.onCreateWorldClicked, this);
        //mainMenu.addMenuItem("Join", this.onJoinClicked, this);
        //mainMenu.addMenuItem("Settings", this.onSettingsClicked, this);
    }

    onSearchClicked() {
        this.socket.emit("SearchForAnOpponent");
    }
    onSearchCancelClicked() {
        this.socket.emit("CancelSearchForAnOpponent");
    }

    onServerSearchingForAnOpponent() {
        var searchMenuItem = this.mainMenu.getMenuItem("Search");
        if (searchMenuItem) {
            searchMenuItem.setActive(false);
        }

        var cancelMenuItem = this.mainMenu.getMenuItem("Cancel");
        if (cancelMenuItem) {
            cancelMenuItem.setActive(true);
        }
    }

    onMatchResult(result) {
        var menuItem = this.mainMenu.getMenuItem("Search");
        if (menuItem) {
            menuItem.setActive(true);
        }

        var cancelMenuItem = this.mainMenu.getMenuItem("Cancel");
        if (cancelMenuItem) {
            cancelMenuItem.setActive(false);
        }

        if (result) {
            this.scene.start("GameSceen", {
                socket: this.socket
            });
        }


    }

    onCreateWorldClicked() {
        this.scene.start("CreateWorldScene");
    }

    onJoinClicked() {
        this.scene.start("JoinServerScene");
    }

    onSettingsClicked() {
        this.scene.start("SettingsScene");
    }
}