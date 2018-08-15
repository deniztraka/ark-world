import { MainMenu } from "../ui/mainMenu";
import { MenuPosition } from "../ui/menuPosition";

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super({
            key: "SettingsScene"
        });
    }

    preload() {

    }

    create() {
        var menuBackgroundImage = this.add.image(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2, "menuBackground");
        menuBackgroundImage.setOrigin(0.5, 0.5);

        var mainMenu = new MainMenu(this, MenuPosition.Bottom);
        mainMenu.addMenuItem("Back", this.onBackClick, this);
        mainMenu.addMenuItem("Setting1", this.onSettings1Click);
        mainMenu.addMenuItem("Setting2", this.onSettings2Click);
        mainMenu.addMenuItem("Setting3", this.onSettings3Click);

    }

    onSettings1Click() {
        console.log("setting1 clicked");
    }

    onSettings2Click() {
        console.log("setting2 clicked");
    }

    onSettings3Click() {
        console.log("setting3 clicked");
    }

    onBackClick() {
        this.scene.start("MainMenuScene");
    }
}