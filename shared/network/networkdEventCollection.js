const BaseTypes = require("./../../shared/serialize/baseTypes");
const Serializable = require("./../../shared/serialize/serializable");

/**
 * Defines a collection of NetworkEvents to be transmitted over the wire
 */
class NetworkedEventCollection extends Serializable {

    static get netScheme() {
        return {
            events: {
                type: BaseTypes.TYPES.LIST,
                itemType: BaseTypes.TYPES.CLASSINSTANCE
            },
        };
    }

    constructor(events) {
        super();
        this.events = events || [];
    }

}

module.exports = NetworkedEventCollection;