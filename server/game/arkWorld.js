const GameWorld = require('../engines/gameWorld');
const uuidv1 = require('uuid/v1');
const WorldState = require('./worldState');
const Dungeon = require("@mikewesthad/dungeon");

class ArkWorld extends GameWorld {

    constructor(options) {
        super(options);
        var self = this;
        this.id = uuidv1();
        this.worldState = WorldState.Initializing;
        this.mapData = {};
        this.dungeon = {};
    }

    initWorld() {
        var self = this;
        //CreateMap in here
        var options = {
            width: 50,
            height: 50,
            doorPadding: 1, // Experimental, minimum number of tiles between a door and a room corner (>= 1)
            //randomSeed: 0, // Leave undefined if you don't want to control the seed
            rooms: {
                width: {
                    min: 10,
                    max: 30,
                    onlyOdd: true // Or onlyEven: true
                },
                height: {
                    min: 10,
                    max: 30,
                    onlyOdd: true // Or onlyEven: true
                },
                maxArea: 150,
                maxRooms: 10
            }
        };
        this.dungeon = new Dungeon(options);
        var indexData = {
            empty: 159,
            floor: 5,
            door: 21,
            wall: 1
        };

        this.mapData = {
            tiles: self.dungeon.getMappedTiles(indexData),
            rooms: self.dungeon.rooms,
            indexes: indexData,
            collisionIndexes: [0, 1, 2, 3, 16, 17, 18, 19, 32, 33, 34, 48, 49, 50, 51],
            environment: {
                tileWidth: 32,
                tileHeight: 32,
                indices: {
                    floors: {
                        outer: [5, 6, 7, 21, 22, 23]
                    },
                    doors: {
                        n_e: 21,
                        s_w: 22
                    },
                    block: 23,
                    walls: {
                        alone: 19,
                        intersections: {
                            e_s: 0,
                            n_e_s_w: 1,
                            e_w: 2,
                            s_w: 3,
                            n_e_s: 16,
                            w: 17,
                            e: 18,
                            n_s_w: 19,
                            n_s: 32,
                            s: 33,
                            e_s_w: 34,
                            n_e: 48,
                            n_e_w: 49,
                            n: 50,
                            n_w: 51
                        }
                    }
                }
            },
            width: options.width,
            height: options.height
        };
        this.worldState = WorldState.Ready;
    }

    start() {
        this.worldState = WorldState.Started;
    }

    getStartingPoints() {

        var randomPoints = this.getRandomFloorPoint();
        return {
            player1: {
                x: randomPoints[0].x,
                y: randomPoints[0].y
            },
            player2: {
                x: randomPoints[1].x,
                y: randomPoints[1].y
            }
        }

    }

    getRandomFloorPoint() {
        var floorPoints = [];

        for (let x = 0; x < this.mapData.tiles.length; x++) {
            var row = this.mapData.tiles[x];
            for (let y = 0; y < row.length; y++) {
                var indice = this.mapData.tiles[x][y];
                if (this.mapData.environment.indices.floors.outer.indexOf(indice) >= 0) {
                    floorPoints.push({
                        x: x,
                        y: y
                    });
                }

            }
        }

        return floorPoints.sort(function() {
                return .5 - Math.random()
            }) // Shuffle array
            .slice(0, 2);
    }

    getWorldStaticData() {
        return this.mapData;
    }

}

module.exports = ArkWorld;