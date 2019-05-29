const GameWorld = require('../engines/gameWorld');
const uuidv1 = require('uuid/v1');
const WorldState = require('./worldState');

class ArkWorld extends GameWorld {

    constructor(options) {
        super(options);
        var self = this;
        this.id = uuidv1();
        this.worldState = WorldState.Initializing;
        this.mapData = [];
        // setTimeout(function(){
        //     self.initWorld();
        // },1000)
    }

    initWorld(){
        //CreateMap in here
        this.worldState = WorldState.Ready;
    }

    start() {
        this.worldState = WorldState.Started;
    }

    getWorldStaticData(){
        return this.mapData;
    }

}

module.exports = ArkWorld;