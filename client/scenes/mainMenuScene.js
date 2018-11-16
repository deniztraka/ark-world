import {
    MainMenu
} from "../ui/mainMenu";


import { MenuPosition } from "../ui/menuPosition";

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: "MainMenuScene"
        });
    }

    preload() {

    }

    create() {
        var menuBackgroundImage = this.add.image(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2, "menuBackground");
        menuBackgroundImage.setOrigin(0.5, 0.5);

        var mainMenu = new MainMenu(this, MenuPosition.Bottom);
        mainMenu.addMenuItem("Create", this.onCreateWorldClicked, this);
        mainMenu.addMenuItem("Join", this.onJoinClicked, this);
        //mainMenu.addMenuItem("Settings", this.onSettingsClicked, this);
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