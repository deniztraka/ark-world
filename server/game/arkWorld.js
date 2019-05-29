const GameWorld = require('../engines/gameWorld');
const uuidv1 = require('uuid/v1');

class ArkWorld extends GameWorld {

    constructor(options) {
        super(options);
        this.id = uuidv1();
        this.mapData = [];
    }

    start() {
        super.start();
    }

}

module.exports = ArkWorld;