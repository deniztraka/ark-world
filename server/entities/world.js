const WorldMap = require('./worldMap');
const Client = require('./client');

class World {

    constructor(seed) {
        this.worldMap = new WorldMap(seed, 100, 100);
        this.mobiles = [];
        this.clients = {};

        this.worldMap.generate();
    }

    addClient(socket, clientName) {
        this.clients[socket.id] = new Client(socket, clientName);

        this.clients[socket.id].syncHandler.send("staticWorldData", this.worldMap.getStaticWorldMapData());
    }

    disconnectClient(socketId) {
        delete this.clients[socketId];
    }

    process() {}


}


module.exports = World;