const InterpolateStrategy = require ('./syncStrategies/interpolateStrategy');
const ExtrapolateStrategy = require ( './syncStrategies/extrapolateStrategy');
const FrameSyncStrategy = require ( './syncStrategies/frameSyncStrategy');

const strategies = {
    extrapolate: ExtrapolateStrategy,
    interpolate: InterpolateStrategy,
    frameSync: FrameSyncStrategy
};

class Synchronizer {
    // create a synchronizer instance
    constructor(clientEngine, options) {
        this.clientEngine = clientEngine;
        this.options = options || {};
        if (!strategies.hasOwnProperty(this.options.sync)) {
            throw new Error(`ERROR: unknown synchronzation strategy ${this.options.sync}`);
        }
        this.syncStrategy = new strategies[this.options.sync](this.clientEngine, this.options);
    }
}

module.exports = Synchronizer;
