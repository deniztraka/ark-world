import {
    BaseMenuItem
} from "./baseMenuItem";

export class MainMenuItem extends BaseMenuItem {
    constructor(_scene, _x, _y, _text) {
        super(_scene, _x, _y, _text);
        this.title = _text;
    }
}