const ServerEngine = require('../engines/serverEngine');
const Scheduler = require('../../shared/lib/Scheduler');

class ArkServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        this.currentlySearchingPlayers = [];
        this.lastMatchTime = this.serverTime;
        this.frequencyForMatch = 1000;

        this.gameEngine.on('worldInitialized', this.onworldInitialized.bind(this));
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


            //create world and room with the same id
            var createdWorld = this.gameEngine.createWorld();
            this.createRoom(createdWorld.id);

            this.gameEngine.trace.info(() => `========== matching players ${client0socketId}&${client1socketId} to room ${createdWorld.id} ==========`);

            //add player to world and assign it to room
            let playerId = this.connectedPlayers[client0socketId].socket.playerId;
            // this.gameEngine.addObjectToWorld(createdWorld.id, {
            //     id: client0socketId,
            //     playerId
            // });
            this.assignPlayerToRoom(playerId, createdWorld.id);
            this.connectedPlayers[client0socketId].socket.join(createdWorld.id);

            //add the other player to world and assign it to room
            playerId = this.connectedPlayers[client1socketId].socket.playerId;
            // this.gameEngine.addObjectToWorld(createdWorld.id, {
            //     id: client1socketId,
            //     playerId
            // });
            this.assignPlayerToRoom(playerId, createdWorld.id);
            this.connectedPlayers[client1socketId].socket.join(createdWorld.id);

            //match result found is sent as true
            this.io.sockets.in(createdWorld.id).emit('MatchResult', true);
            this.gameEngine.initWorld(createdWorld.id, client0socketId, client1socketId);
        }
    }

    onworldInitialized(worldId, client0socketId, client1socketId) {
        var self = this;

        // var world = this.gameEngine.worlds[worldId];
        // var player1 = world.queryObjects({
        //     playerId:
        // });

        //worldId is same as roomId
        var staticWorldData = this.gameEngine.worlds[worldId].getWorldStaticData();

        staticWorldData.startingPoints = this.gameEngine.worlds[worldId].getStartingPoints();

        var mappedStartingPoints = {};
        mappedStartingPoints[client0socketId] = {
            x: staticWorldData.startingPoints.player1.x,
            y: staticWorldData.startingPoints.player1.y
        };

        mappedStartingPoints[client1socketId] = {
            x: staticWorldData.startingPoints.player2.x,
            y: staticWorldData.startingPoints.player2.y
        };

        staticWorldData.startingPoints = mappedStartingPoints;

        console.log(staticWorldData.startingPoints);
        //World initialized in here and mapStaticData is sent to client
        setTimeout(function() {
            self.io.sockets.in(worldId).emit('onWorldReady', staticWorldData);
            self.gameEngine.worlds[worldId].start();
        }, 1000);

    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);

        //remove from currently searching players
        var index = this.currentlySearchingPlayers.indexOf(socketId);
        if (index != -1) {
            this.currentlySearchingPlayers.splice(index, 1);
        }
    }
}

module.exports = ArkServerEngine;