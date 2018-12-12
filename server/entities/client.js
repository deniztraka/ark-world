const SyncronizationHandler = require('../helpers/network/syncronizationHandler');

class Client {

    constructor(socket, name) {
        this.socket = socket;
        this.name = name;
        this.syncHandler = new SyncronizationHandler(socket);
    }
}


module.exports = Client;