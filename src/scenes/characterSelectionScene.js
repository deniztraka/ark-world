import {
    MainMenu
} from "../ui/mainMenu";
import {
    MenuPosition
} from "../ui/menuPosition";

import {
    Player
} from "../core/player";

export class CharacterSelectionScene extends Phaser.Scene {
    constructor() {
        super({
            key: "CharacterSelectionScene"
        });


    }

    preload() {

    }

    create() {
        var menuBackgroundImage = this.add.image(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2, "menuBackground");
        menuBackgroundImage.setOrigin(0.5, 0.5);

        var mainMenu = new MainMenu(this, MenuPosition.Bottom);
        mainMenu.addMenuItem("Back", this.onBackClick, this);
        mainMenu.addMenuItem("Enter", this.onEnterClick, this);

        //this.player = new Player(this, this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2 - 100);
    }

    onBackClick() {
        this.scene.start("MainMenuScene");
    }

    onEnterClick() {
        this.scene.start("GameScene");
    }

    update() {}
}