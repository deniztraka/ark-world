const Enum = require('enum');
class WorldState extends Enum {
    constructor() {
        super(['Initializing', 'Ready', 'Started','Dead']);
    }
}
module.exports = WorldState;