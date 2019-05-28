const GameEngine = require('../engines/gameEngine');
const ArkWorld = require('../game/arkWorld');

class ArkGameEngine extends GameEngine {

    constructor(options) {
        super(options);
    }

    start() {
        super.start();
    }

    step(isReenact, t, dt, physicsOnly){
        super.step(isReenact, t, dt, physicsOnly);
    }

    createWorld() {
        var world = new ArkWorld();
        this.worlds[world.id] = world;
        return this.worlds[world.id];
    }
}

module.exports = ArkGameEngine;