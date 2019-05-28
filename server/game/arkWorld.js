const GameWorld = require('../engines/gameWorld');
const uuidv1 = require('uuid/v1');

class ArkWorld extends GameWorld {

    constructor(options) {
        super(options);
        this.id = uuidv1();
    }

    start() {
        super.start();
    }
}

module.exports = ArkWorld;