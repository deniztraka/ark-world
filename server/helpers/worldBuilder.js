const World = require('../entities/world');

class WorldBuilder {

    constructor() {

    }

    create() {
        return new World(4);
    }
}

module.exports = WorldBuilder;