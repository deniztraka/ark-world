import {
    BaseMenu
} from "./baseMenu";
import {
    MainMenuItem
} from "./mainMenuItem";
import {
    MenuPosition
} from "../ui/menuPosition";
import {
    S_IWGRP
} from "constants";

// console.log(MenuPosition.enumValueOf('Center') === MenuPosition.Center); // true
// console.log(MenuPosition.Center instanceof MenuPosition); // true


export class MainMenu extends BaseMenu {
    constructor(_phaserScene, _menuPosition) {
        super(_phaserScene, _menuPosition);
        this.menuItemPositionX = this.phaserScene.scene.manager.game.renderer.width / 2;
        this.menuItemPositionY = this.phaserScene.scene.manager.game.renderer.height / 2;
    }

    calculateMenuItemPositions() {
        var self = this;
        switch (this.menuPosition) {
            case MenuPosition.Center:
                this.menuItems.forEach(function(item, index) {
                    let y = ((self.phaserScene.scene.manager.game.renderer.height - 200) / self.menuItems.length * index) + 200;
                    item.y = y;
                });
                break;
            case MenuPosition.Bottom:
                this.menuItems.forEach(function(item, index) {
                    item.y = self.phaserScene.scene.manager.game.renderer.height - 50;
                    item.x = ((self.phaserScene.scene.manager.game.renderer.width) / self.menuItems.length * index) + self.phaserScene.scene.manager.game.renderer.width / 2 / self.menuItems.length; // ortala
                });
                break;
            case MenuPosition.Top:
                this.menuItems.forEach(function(item, index) {
                    item.y = 50;
                    item.x = ((self.phaserScene.scene.manager.game.renderer.width) / self.menuItems.length * index) + self.phaserScene.scene.manager.game.renderer.width / 2 / self.menuItems.length; // ortala
                });
                break;
            case MenuPosition.Right:
                this.menuItems.forEach(function(item, index) {
                    item.y = ((self.phaserScene.scene.manager.game.renderer.height - 200) / self.menuItems.length * index) + 200;
                    item.x = self.phaserScene.scene.manager.game.renderer.width - 100;
                });
                break;
            case MenuPosition.Left:
                this.menuItems.forEach(function(item, index) {
                    item.y = ((self.phaserScene.scene.manager.game.renderer.height - 200) / self.menuItems.length * index) + 200;
                    item.x = 100;
                });
                break;
            default:
                this.menuItems.forEach(function(item, index) {
                    item.y = ((self.phaserScene.scene.manager.game.renderer.height - 200) / self.menuItems.length * index) + 200;
                });
                break;
        }
    }

    addMenuItem(_title, _onClickCallback, _scope) {
        this.menuItems.push(new MainMenuItem(this.phaserScene, this.menuItemPositionX, this.menuItemPositionY, _title));
        this.menuItems[this.menuItems.length - 1].setOrigin(0.5, 0.5);
        this.menuItems[this.menuItems.length - 1].setInteractive();
        this.menuItems[this.menuItems.length - 1].on("pointerdown", _onClickCallback, _scope);
        this.menuItems[this.menuItems.length - 1].on("pointerover", this.onOverCallback, this.menuItems[this.menuItems.length - 1]);
        this.menuItems[this.menuItems.length - 1].on("pointerout", this.onOutCallback, this.menuItems[this.menuItems.length - 1]);

        this.calculateMenuItemPositions();
    }

    onOverCallback() {
        this.setStyle({
            fill: "#fff",
            fontSize: '30px'
        });
    }

    onOutCallback() {
        this.setStyle({
            fill: "#ccc",
            fontSize: '26px'
        });
    }
}