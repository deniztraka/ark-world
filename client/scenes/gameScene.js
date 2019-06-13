const GAME_UPS = 60; // default number of game steps per second
const STEP_DELAY_MSEC = 12; // if forward drift detected, delay next execution by this amount
const STEP_HURRY_MSEC = 8; // if backward drift detected, hurry next execution by this amount

import {
    Player
} from '../entities/mobiles/basicPlayer';

import Serializer from './../../shared/serialize/serializer';
import NetworkTransmitter from './../../shared/network/networkTransmitter';
import NetworkMonitor from './../../shared/network/networkMonitor';
import ClientGameEngine from './../core/clientGameEngine';
import Synchronizer from './../../shared/engines/syncronizer';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene"
        });
        this.controls = null;

        var self = this;
        this.eventEmitter = new Phaser.Events.EventEmitter();
        this.serializer = new Serializer();
        this.networkTransmitter = new NetworkTransmitter(this.serializer);

        // this.eventEmitter.on("playerPositionChanged!", function(newIsoTileData) {
        //     self.cullMap(newIsoTileData);
        // });

        //this.renderSize = 10;
        this.inputOptions = {};

        this.options = Object.assign({
            autoConnect: true,
            healthCheckInterval: 1000,
            healthCheckRTTSample: 10,
            stepPeriod: 1000 / GAME_UPS,
            scheduler: 'render-schedule',
            serverURL: null,
            delayInputCount: 3,
            syncOptions: {
                sync: 'extrapolate',
                localObjBending: 0.0,
                remoteObjBending: 0.8,
                bendingIncrements: 6
            }
        }, this.inputOptions);


        this.shadows = [];
        this.staticMapData = null;

        this.gameEngine = new ClientGameEngine(this.options, this);
        
        this.serializer = new Serializer();
        this.gameEngine.registerClasses(this.serializer);
        this.networkTransmitter = new NetworkTransmitter(this.serializer);
        this.networkMonitor = new NetworkMonitor();
        this.inboundMessages = [];
        this.outboundMessages = [];

        // step scheduler
        this.scheduler = null;
        this.lastStepTime = 0;
        this.correction = 0;


    }

    init(obj) {

        var self = this;
        this.staticMapData = obj.staticMapData;
        this.socket = obj.socket;
        //console.log(this.staticMapData);

        // this.socket.on("worldUpdate", function(data) {
        //     let syncEvents = self.networkTransmitter.deserializePayload(data).events;
        //     console.log(syncEvents);
        // });
        this.socket.on("disconnect", function () {
            self.scene.start("LoginScreen");
        });

        this.configureSynchronization();

        // create a buffer of delayed inputs (fifo)
        if (this.inputOptions && this.inputOptions.delayInputCount) {
            this.delayedInputs = [];
            for (let i = 0; i < inputOptions.delayInputCount; i++)
                this.delayedInputs[i] = [];
        }

        this.gameEngine.emit('client__init');



        // this.socket.on('playerJoined', (playerData) => {
        //     this.gameEngine.playerId = playerData.playerId;
        //     this.messageIndex = Number(this.gameEngine.playerId) * 10000;
        // });

        // this.socket.on('worldUpdate', (worldData) => {
        //     this.inboundMessages.push(worldData);
        // });

        // this.socket.on('roomUpdate', (roomData) => {
        //     this.gameEngine.emit('client__roomUpdate', roomData);
        // });
    }

    preload() {

    }

    create() {
        this.map = null;
        this.mapLayers = null;

        this.tileStackData = {};

        if (this.staticMapData) {
            this.createWorld();
            this.createPlayer();
        }
        // this.input.on('pointerdown', function (pointer) {


        //     var tile = this.map.getTileAtWorldXY(pointer.x, pointer.y, true, this.cam, this.mapLayers["layer0"]);
        //     console.log(tile.x + "," + tile.y);


        // }, this);
    }

    update(time, delta) {
        var self = this;

        this.gameEngine.step(time,delta);

    }

    createPlayer() {
        // console.log(this.socket.id);
        // console.log(this.staticMapData.startingPoints[this.socket.id]);
        this.player = new Player(this, this.staticMapData.startingPoints[this.socket.id].x, this.staticMapData.startingPoints[this.socket.id].y);
    }

    createWorld() {
        var self = this;

        this.map = this.make.tilemap({
            tileWidth: self.staticMapData.environment.tileWidth,
            tileHeight: self.staticMapData.environment.tileHeight,
            width: self.staticMapData.width,
            height: self.staticMapData.height
        });
        var tiles = this.map.addTilesetImage('rogueLike_tiles_extended');
        this.mapLayers = {
            layer0: self.map.createBlankDynamicLayer('layer0', tiles),
        };

        //var tile = this.map.putTileAt(56,0, 0, true, this.mapLayers["layer0"]);

        var staticLayer = this.mapLayers["layer0"]
        for (var x = 0; x < self.staticMapData.width; x++) {
            for (var y = 0; y < self.staticMapData.height; y++) {
                //debugger;
                if (self.staticMapData.tiles[x][y] == this.staticMapData.indexes.wall) {
                    this.map.putTileAt(self.getWallIndex(x, y), x, y, true, staticLayer);
                } else if (self.staticMapData.tiles[x][y] == this.staticMapData.indexes.floor) {
                    this.map.putTileAt(self.getFloorIndex(x, y), x, y, true, staticLayer);
                } else if (self.staticMapData.tiles[x][y] == this.staticMapData.indexes.door) {
                    this.map.putTileAt(self.getFloorIndex(x, y), x, y, true, staticLayer);
                } else {
                    this.map.putTileAt(self.getEmptyIndex(x, y), x, y, true, staticLayer);
                }
            }
        }

        this.mapLayers["layer0"].setCollision(self.staticMapData.collisionIndexes);
    }

    getFloorIndex(x, y) {
        return this.staticMapData.environment.indices.floors.outer.sort(function () {
            return .5 - Math.random()
        })[0];
    }

    getDoorIndex(x, y) {
        const neighbours = {
            n: this.staticMapData.tiles[x][y - 1],
            s: this.staticMapData.tiles[x][y + 1],
            w: this.staticMapData.tiles[x - 1][y],
            e: this.staticMapData.tiles[x + 1][y],
            nw: this.staticMapData.tiles[x - 1][y - 1],
            ne: this.staticMapData.tiles[x + 1][y - 1],
            sw: this.staticMapData.tiles[x - 1][y + 1],
            se: this.staticMapData.tiles[x + 1][y + 1]
        };

        const n = neighbours.n && neighbours.n === this.staticMapData.indexes.wall;
        const s = neighbours.s && neighbours.s === this.staticMapData.indexes.wall;
        const w = neighbours.w && neighbours.w === this.staticMapData.indexes.wall;
        const e = neighbours.e && neighbours.e === this.staticMapData.indexes.wall;

        const i = this.staticMapData.environment.indices.doors;

        if (n && e) {
            return i.ne;
        }
        if (s && e) {
            return i.s_e;
        }
    }

    getEmptyIndex(x, y) {
        return this.staticMapData.indexes.empty;
    }

    getWallIndex(x, y) {
        const neighbours = {
            n: this.staticMapData.tiles[x][y - 1],
            s: this.staticMapData.tiles[x][y + 1],
            w: this.staticMapData.tiles[x - 1][y],
            e: this.staticMapData.tiles[x + 1][y],
            nw: this.staticMapData.tiles[x - 1][y - 1],
            ne: this.staticMapData.tiles[x + 1][y - 1],
            sw: this.staticMapData.tiles[x - 1][y + 1],
            se: this.staticMapData.tiles[x + 1][y + 1]
        };

        const n = neighbours.n && neighbours.n === this.staticMapData.indexes.wall;
        const s = neighbours.s && neighbours.s === this.staticMapData.indexes.wall;
        const w = neighbours.w && neighbours.w === this.staticMapData.indexes.wall;
        const e = neighbours.e && neighbours.e === this.staticMapData.indexes.wall;

        const i = this.staticMapData.environment.indices.walls;

        if (n && e && s && w) {
            return i.intersections.n_e_s_w;
        }
        if (n && e && s) {
            return i.intersections.n_e_s;
        }
        if (n && s && w) {
            return i.intersections.n_s_w;
        }
        if (e && s && w) {
            return i.intersections.e_s_w;
        }
        if (n && e && w) {
            return i.intersections.n_e_w;
        }

        if (e && s) {
            return i.intersections.e_s;
        }
        if (e && w) {
            return i.intersections.e_w;
        }
        if (s && w) {
            return i.intersections.s_w;
        }
        if (n && s) {
            return i.intersections.n_s;
        }
        if (n && e) {
            return i.intersections.n_e;
        }
        if (n && w) {
            return i.intersections.n_w;
        }

        if (n) {
            return i.intersections.n;
        }
        if (s) {
            return i.intersections.s;
        }
        if (e) {
            return i.intersections.e;
        }
        if (w) {
            return i.intersections.w;
        }

        return i.alone;
    }

    configureSynchronization() {

        // the reflect syncronizer is just interpolate strategy,
        // configured to show server syncs
        let syncOptions = this.options.syncOptions;
        if (syncOptions.sync === 'reflect') {
            syncOptions.sync = 'interpolate';
            syncOptions.reflect = true;
        }

        this.synchronizer = new Synchronizer(this, syncOptions);
    }

     // apply a user input on the client side
     doInputLocal(message) {

        // some synchronization strategies (interpolate) ignore inputs on client side
        if (this.gameEngine.ignoreInputs) {
            return;
        }

        const inputEvent = { input: message.data, playerId: this.gameEngine.playerId };
        this.gameEngine.emit('client__processInput', inputEvent);
        this.gameEngine.emit('processInput', inputEvent);
        this.gameEngine.processInput(message.data, this.gameEngine.playerId, false);
    }

    // apply user inputs which have been queued in order to create
    // an artificial delay
    applyDelayedInputs() {
        if (!this.delayedInputs) {
            return;
        }
        let that = this;
        let delayed = this.delayedInputs.shift();
        if (delayed && delayed.length) {
            delayed.forEach(that.doInputLocal.bind(that));
        }
        this.delayedInputs.push([]);
    }

    /**
     * This function should be called by the client whenever a user input
     * occurs.  This function will emit the input event,
     * forward the input to the client's game engine (with a delay if
     * so configured) and will transmit the input to the server as well.
     *
     * This function can be called by the extended client engine class,
     * typically at the beginning of client-side step processing (see event client__preStep)
     *
     * @param {String} input - string representing the input
     * @param {Object} inputOptions - options for the input
     */
    sendInput(input, inputOptions) {
        let inputEvent = {
            command: 'move',
            data: {
                messageIndex: this.messageIndex,
                step: this.gameEngine.world.stepCount,
                input: input,
                options: inputOptions
            }
        };

        this.gameEngine.trace.info(() => `USER INPUT[${this.messageIndex}]: ${input} ${inputOptions ? JSON.stringify(inputOptions) : '{}'}`);

        // if we delay input application on client, then queue it
        // otherwise apply it now
        if (this.delayedInputs) {
            this.delayedInputs[this.delayedInputs.length - 1].push(inputEvent);
        } else {
            this.doInputLocal(inputEvent);
        }

        if (this.options.standaloneMode !== true) {
            this.outboundMessages.push(inputEvent);
        }

        this.messageIndex++;
    }

    // handle a message that has been received from the server
    handleInboundMessage(syncData) {

        let syncEvents = this.networkTransmitter.deserializePayload(syncData).events;
        let syncHeader = syncEvents.find((e) => e.eventName === 'syncHeader');

        // emit that a snapshot has been received
        if (!this.gameEngine.highestServerStep || syncHeader.stepCount > this.gameEngine.highestServerStep)
            this.gameEngine.highestServerStep = syncHeader.stepCount;
        this.gameEngine.emit('client__syncReceived', {
            syncEvents: syncEvents,
            stepCount: syncHeader.stepCount,
            fullUpdate: syncHeader.fullUpdate
        });

        this.gameEngine.trace.info(() => `========== inbound world update ${syncHeader.stepCount} ==========`);

        // finally update the stepCount
        if (syncHeader.stepCount > this.gameEngine.world.stepCount + this.synchronizer.syncStrategy.STEP_DRIFT_THRESHOLDS.clientReset) {
            this.gameEngine.trace.info(() => `========== world step count updated from ${this.gameEngine.world.stepCount} to  ${syncHeader.stepCount} ==========`);
            this.gameEngine.emit('client__stepReset', { oldStep: this.gameEngine.world.stepCount, newStep: syncHeader.stepCount });
            this.gameEngine.world.stepCount = syncHeader.stepCount;
        }
    }

    // emit an input to the authoritative server
    handleOutboundInput() {
        for (var x = 0; x < this.outboundMessages.length; x++) {
            this.socket.emit(this.outboundMessages[x].command, this.outboundMessages[x].data);
        }
        this.outboundMessages = [];
    }

}