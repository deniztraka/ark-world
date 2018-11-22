const WorldMap = require('./worldMap');

class World {

    constructor(seed) {
        this.worldMap = new WorldMap(seed, 100, 100);
        this.mobiles = [];

        this.worldMap.generate();
    }

    process() {}


}


module.exports = World;