const WorldMapData = require('./worldMapData');

class WorldMap {

    constructor(seed, width, height) {
        this.worldMapData = new WorldMapData(seed, width, height, 32, 32);
    }

    generate() {
        this.worldMapData.generate();
    }

    getStaticWorldMapData() {
        var self = this;
        var staticMapData = {
            cellHeight: 16,
            cellWidth: 16,
            width: self.worldMapData.width,
            height: self.worldMapData.height,
            tileData: [...Array(this.worldMapData.width)].map(x => Array(this.worldMapData.height).fill(0)),
            collisionIndexes: [15, 14, 0]
        };

        for (var x = 0; x < staticMapData.width; x++) {
            for (var y = 0; y < staticMapData.height; y++) {

                staticMapData.tileData[x][y] = {
                    index: this.worldMapData.biomeData[x][y].tileIndex,
                    name: this.worldMapData.biomeData[x][y].name,
                    elevation: this.worldMapData.getElevation(x, y, true)
                };
            }
        }

        return staticMapData;
    }
}



module.exports = WorldMap;