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
                    min: 5,
                    max: 10,
                    onlyOdd: true // Or onlyEven: true
                },
                height: {
                    min: 8,
                    max: 20,
                    onlyOdd: true // Or onlyEven: true
                },
                maxArea: 150,
                maxRooms: 50
            }
        };
        this.dungeon = new Dungeon(options);
        this.mapData = {
            tiles: self.dungeon.tiles,
            rooms: self.dungeon.rooms,
            indexes: {
                empty: 0,
                floor: 1,
                door: 2,
                wall: 3
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