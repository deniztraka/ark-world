class SyncronizationHandler {

    constructor(socket) {
        this.socket = socket;
    }

    send(eventName, data) {
        this.socket.emit(eventName, data);
    }
}

module.exports = SyncronizationHandler;