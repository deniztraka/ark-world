import GameEngine from "./../../shared/engines/gameEngine";

export default class ClientGameEngine extends GameEngine {
    constructor(options, scene) {
        super(options);
        this.scene = scene;
    }
}