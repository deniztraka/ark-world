const ServerEngine = require('../engines/serverEngine');
const Scheduler = require('../lib/Scheduler');

class ArkServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        this.currentlySearchingPlayers = [];
        this.lastMatchTime = this.serverTime;
        this.frequencyForMatch = 1000;
    }

    start() {
        super.start();
        var self = this;
        let schedulerConfig = {
            tick: self.searchForAMatch.bind(this),
            period: 60000 / 60,
            delay: 4
        };
        this.scheduler = new Scheduler(schedulerConfig).start();
    }

    step() {
        super.step();

        //console.log(this.lastMatchTime - this.serverTime);


    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        var self = this;

        socket.on('hiFromClient', function(data) {
            //authentication needed
            socket.emit("handShaked", true);

            self.connectedPlayers[socket.id].playerName = data;
        });

        socket.on('SearchForAnOpponent', function() {
            self.onPlayerSearchForAnOpponent(socket.id);
        });

        socket.on('CancelSearchForAnOpponent', function() {
            self.onCancelSearchForAnOpponent(socket.id);
        });


    }

    onCancelSearchForAnOpponent(searchingSocketId) {
        var self = this;
        this.connectedPlayers[searchingSocketId].isSearching = false;

        var index = this.currentlySearchingPlayers.indexOf(searchingSocketId);
        if (index != -1) {
            this.currentlySearchingPlayers.splice(index, 1);
        }

        this.connectedPlayers[searchingSocketId].socket.emit("MatchResult", false);
    }

    onPlayerSearchForAnOpponent(searchingSocketId) {
        this.connectedPlayers[searchingSocketId].isSearching = true;
        this.currentlySearchingPlayers.push(searchingSocketId);
        this.connectedPlayers[searchingSocketId].socket.emit("ServerSearchingForAnOpponent");
    }

    searchForAMatch() {
        if (this.currentlySearchingPlayers.length > 1) {
            var results = this.currentlySearchingPlayers
                .sort(function() {
                    return .5 - Math.random()
                }) // Shuffle array
                .slice(0, 2); // Get first 2 items

            var client0socketId = results[0];
            var client1socketId = results[1];

            this.currentlySearchingPlayers.splice(0, 1);
            this.currentlySearchingPlayers.splice(0, 1);

            this.connectedPlayers[client0socketId].isSearching = false;
            this.connectedPlayers[client1socketId].isSearching = false;
            this.connectedPlayers[client0socketId].socket.emit("MatchResult", true);
            this.connectedPlayers[client1socketId].socket.emit("MatchResult", true);
        }
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        var index = this.currentlySearchingPlayers.indexOf(socketId);
        if (index != -1) {
            this.currentlySearchingPlayers.splice(index, 1);
        }
    }
}

module.exports = ArkServerEngine;