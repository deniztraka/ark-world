const {
    libnoise
} = require('libnoise');

const Biomes = require('../data/biome');

const DungeonGenerator = require('dungeon-generator');
const WorldMapData = require('./worldMapData');

class DungeonMapData extends WorldMapData {

    constructor(seed, width, height, cellWidth, cellHeight) {
        super(seed, width, height, cellWidth, cellHeight);
        this.dungeon = null;
    }

    generate(pSeed) {
        if (pSeed) {
            this.seed = pSeed;
        }

        let options = {
            size: [this.width, this.height],
            seed: pSeed, //omit for generated seed
            rooms: {
                initial: {
                    min_size: [3, 3],
                    max_size: [3, 3],
                    max_exits: 1,
                    position: [0, 0] //OPTIONAL pos of initial room 
                },
                any: {
                    min_size: [2, 2],
                    max_size: [5, 5],
                    max_exits: 4
                }
            },
            max_corridor_length: 6,
            min_corridor_length: 2,
            corridor_density: 0.5, //corridors per room
            symmetric_rooms: false, // exits must be in the center of a wall if true
            interconnects: 1, //extra corridors to connect rooms and make circular paths. not 100% guaranteed
            max_interconnect_length: 10,
            room_count: 50
        };

        this.generateWith(options);
        this.generateBiomeData();
    }

    generateWith(options) {
        var generator = new DungeonGenerator(options);
        generator.generate();
        this.dungeon = generator;
    }

    getRandomPoint(biomeName) {
        var rX = Math.floor(Math.random() * this.width);
        var rY = Math.floor(Math.random() * this.height);

        if (this.biomeData[rX][rY].name == biomeName) {

            return {
                x: rX,
                y: rY
            };
        } else {
            //console.log("tried " + rX + " " + rY + " " + this.biomeData[rX][rY].name);
            return this.getRandomPoint(biomeName);
        }
    }



    generateBiomeData() {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.biomeData[x][y] = this.getBiome(x, y);
            }
        }
    }

    getElevation(x, y, base) {
        if (base) {
            var baseElevation = Math.floor(this.elevationData[x][y] * 10) - 5; //because seaa is lower than elevation 5 so we start at 1;
            if (baseElevation < 0) {
                baseElevation = 0;
            }
            return baseElevation;
        } else {
            return this.elevationData[x][y];
        }
    }

    getBiome(x, y) {
        return this.dungeon.walls.get([x, y]) ? Biomes.DungeonWall : Biomes.DungeonFloor;
    }
};

module.exports = DungeonMapData;