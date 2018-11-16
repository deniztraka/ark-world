export class BaseMenu {
    constructor(_phaserScene, _menuPosition) {
        if (new.target === BaseMenu) {
            throw new TypeError("Cannot construct BaseMenu instances directly");
        }
        this.phaserScene = _phaserScene;
        this.menuItems = [];
        this.menuPosition = _menuPosition;


    }

    addMenuItem(_title, _onClickCallback) {
        throw new TypeError("Must override method");
    }

    removeMenuItem(_title) {
        //TODO: implement
    }
}