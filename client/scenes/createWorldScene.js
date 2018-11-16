import {
    MainMenu
} from "../ui/mainMenu";
import {
    MenuPosition
} from "../ui/menuPosition";

export class CreateWorldScene extends Phaser.Scene {
    constructor() {
        super({
            key: "CreateWorldScene"
        });


    }

    preload() {

    }

    create() {
        var mainMenu = new MainMenu(this, MenuPosition.Bottom);
        mainMenu.addMenuItem("Back", this.onBackClick, this);
        mainMenu.addMenuItem("Enter", this.onEnterClick, this);

        console.log("hello");
    }

    onBackClick() {
        this.scene.start("MainMenuScene");
    }

    onEnterClick() {
        this.scene.start("GameScene");
    }

    update() {

    }
}