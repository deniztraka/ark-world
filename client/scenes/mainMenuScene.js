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

        var mainMenu = new MainMenu(this, MenuPosition.Center);
        mainMenu.addMenuItem("Play", this.onPlayClick, this);
        mainMenu.addMenuItem("Settings", this.onSettingsClick, this);
    }

    onPlayClick() {
        this.scene.start("CharacterSelectionScene");
    }

    onSettingsClick() {
        this.scene.start("SettingsScene");
    }

    onQuitClick() {
        console.log("quit clicked");
    }
}