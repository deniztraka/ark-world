var config = require('./common/config.js');
var logger = require('./common/logger.js');
var utils = require('./common/utils.js');

class WorldSimulator {
    constructor(world) {
        this.lastTimeSeconds = 0;
        this.totalElapsedTimeFromSeconds = 0;
        this.timer = null;
        this.world = world;
    }

    start() {
        let self = this;
        this.timer = setInterval(function() {
            self.mainLoop();
        }, 1000 * config.server.serverProcessFrequency);

    }

    mainLoop() {
        let self = this;

        this.totalElapsedTimeFromSeconds += config.server.serverProcessFrequency;
        let deltaTime = this.totalElapsedTimeFromSeconds - this.lastTimeSeconds;


        this.world.process(deltaTime);


        utils.timerMechanics.executeByIntervalFromSeconds(this.totalElapsedTimeFromSeconds, 1 / 60,
            function() {
                //self.networkedWorld.updateClientsPositions();
            });

        this.world.totalElapsedTimeFromSeconds = this.totalElapsedTimeFromSeconds;
        this.lastTimeSeconds = this.totalElapsedTimeFromSeconds;

        //Terminal Logging
        utils.timerMechanics.executeByIntervalFromSeconds(this.totalElapsedTimeFromSeconds, 1,
            function() {
                logger.terminal.debug("Total elapsed time from seconds: " + Math.floor(self.totalElapsedTimeFromSeconds));
            });
    }

    stop() {
        clearInterval(this.timer);
    }
}

module.exports = WorldSimulator;