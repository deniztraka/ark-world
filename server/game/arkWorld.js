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
                maxRooms: 3
            }
        };
        this.dungeon = new Dungeon(options);
        this.mapData = {
            tiles: self.dungeon.tiles,
            rooms: self.dungeon.rooms,
            indexes: {
                empty: 0x9a,
                floor: 0x05,
                door: 0x81,
                wall: 0x14
            },
            collisionIndexes: [0x14],
            environment: {
                width: 16,
                height: 16,
                indices: {
                    floor: {
                        outer: [0x05, 0x05, 0x05, 0x15, 0x07, 0x17]
                    },
                    block: 0x17,
                    walls: {
                        alone: 0x14,
                        intersections: {
                            e_s: 0x00,
                            n_e_s_w: 0x01,
                            e_w: 0x02,
                            s_w: 0x03,
                            n_e_s: 0x10,
                            w: 0x11,
                            e: 0x12,
                            n_s_w: 0x13,
                            n_s: 0x20,
                            s: 0x21,
                            e_s_w: 0x22,
                            n_e: 0x30,
                            n_e_w: 0x31,
                            n: 0x32,
                            n_w: 0x33
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

    getWorldStaticData() {
        return this.mapData;
    }

}

module.exports = ArkWorld;