const WorldMapData = require('./worldMapData');

class WorldMap {

    constructor(seed, width, height) {
        this.worldMapData = new WorldMapData(seed, width, height, 32, 32);
    }

    generate() {
        this.worldMapData.generate();
    }
}



module.exports = WorldMap;