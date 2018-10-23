import {
    WorldData
} from '../data/worldData';
import {
    Tree
} from '../entities/tree';
import {
    Brick
} from '../entities/brick';
import {
    Biomes
} from '../data/biomes';

import {
    IsoDynamicTileMapLayer
} from '../plugins/isoPlugin/isoDynamicTileMapLayer';

import
IsoPlugin
from '../plugins/rotatesIso/isoPlugin';

import {
    IsoPhysics
}
from '../plugins/rotatesIso/isoPlugin';

import {
    Player
} from '../entities/mobiles/player';

import * as IsoTileHelper from '../core/tilemap/isoTileHelper';

export class GameScene extends Phaser.Scene {
    constructor() {

        super({
            key: "GameScene",
            mapAdd: {
                isoPlugin: 'iso',
                isoPhysics: 'isoPhysics'
            }
        });
        this.controls = null;

        // this.sys.settings.map.isoPlugin = "iso";
        // this.sys.settings.map.isoPhysics = "isoPhysics";
        var self = this;
        this.eventEmitter = new Phaser.Events.EventEmitter();
        this.eventEmitter.on("playerPositionChanged!", function(newIsoTileData) {
            self.cullMap(newIsoTileData);
        });

        this.renderSize = 10;
    }


    preload() {
        this.load.scenePlugin(
            'IsoPlugin',
            IsoPlugin,
            'iso',
            'iso'
        );

        this.load.scenePlugin(
            'IsoPhysics',
            IsoPhysics,
            'isoPhysics',
            'isoPhysics'
        );
    }

    create() {
        var self = this;

        var controlConfig = {
            camera: this.cameras.main,
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            speed: 1,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        };
        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        this.map = null;
        this.mapLayers = null;

        this.tileStackData = {};
        this.isoGroup = this.add.group();

        var isoWorldData = new WorldData(1234124, 25, 25, 64, 64);
        isoWorldData.generate();
        isoWorldData.generateTreePositions();
        this.worldData = isoWorldData;

        this.isoPhysics.world.gravity.setTo(0, 0, -500);
        this.isoPhysics.projector.origin.setTo(0.5, 0.1);

        this.projectionX = 36;
        this.projectionY = 36;
        this.projectionZ = 32;


        //this.isoPhysics.world.setBounds(0, 0, 0, 5000, 5000, 5000);

        this.createWithCustomPlugin(isoWorldData);

        //this.createTexture(worldData, true);
        //debugger;
        this.createPlayer();
        this.cullMap(this.player.currentMapPosition);

    }

    createPlayer() {

        this.player = new Player(this, Math.floor(this.worldData.width / 2), Math.floor(this.worldData.height / 2), this.isoGroup);
        //this.cameras.main.startFollow(this.player)

    }

    updateMap(newIsoTileData) {
        //console.log(newIsoTileData);

        if (newIsoTileData.x >= 0 || newIsoTileData.x < 30 || newIsoTileData.y < 30 || newIsoTileData.y >= 0) {

            for (var key in this.tileStackData) {
                var elevationLevel = this.tileStackData[key];
                debugger;
                if (this.player.currentMapPosition) {
                    elevationLevel.forEach(tile => {
                        if ((tile.tileData.x < this.player.currentMapPosition.x - (this.renderSize / 2)) || (tile.tileData.x > this.player.currentMapPosition.x + (this.renderSize / 2))) {
                            //console.log(tile.tileData);
                            //tile.body.destroy();
                            tile.visible = false;
                        } else if ((tile.tileData.y < this.player.currentMapPosition.y - (this.renderSize / 2)) || (tile.tileData.y > this.player.currentMapPosition.y + (this.renderSize / 2))) {
                            //console.log(tile.tileData);
                            //tile.body.destroy();
                            tile.visible = false;
                        } else {
                            tile.visible = true;

                        }


                        // if (tile.tileData.y < this.player.currentIsoTile.tileData.y - (this.renderSize / 2)) {
                        //     console.log(tile.tileData);
                        //     //tile.body.destroy();
                        //     tile.visible = false;
                        // } else {
                        //     tile.visible = true;
                        // }
                    });
                }
            }



        }


    }

    clearMap() {

    }

    createNewMap() {

    }

    createWithCustomPlugin(worldData) {
        for (var x = 0; x < worldData.width; x++) {
            for (var y = 0; y < worldData.height; y++) {
                var tile = IsoTileHelper.createIsoTile(this, x, y, 0, 'isoDirt', this.isoGroup, 0);

                for (let i = 1; i <= 5; i++) {
                    var elevation = worldData.getElevation(x, y, true);
                    if (i <= elevation) {
                        var elevationTile = IsoTileHelper.createIsoTile(this, x, y, i * this.projectionZ, 'isoDirt', this.isoGroup, elevation);
                    }

                }
            }
        }
    }

    update(time, delta) {
        this.controls.update(delta);
        this.eventEmitter.emit("gameSceneUpdate!", time, delta);

    }

    cullMap(newIsoTileData) {
        //this.updateMap(newIsoTileData);
    }






    createTexture(worldData, useColor) {
        var gridSize = 1;

        var texture = this.textures.createCanvas('mapTexture', worldData.width * gridSize, worldData.height * gridSize);
        for (var x = 0; x < worldData.width; x++) {
            for (var y = 0; y < worldData.height; y++) {
                var biome = worldData.getBiome(worldData.elevationData[x][y], worldData.moistureData[x][y], useColor);
                texture.context.fillStyle = biome.color;
                texture.context.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
            }
        }

        //tree placement
        worldData.treePositions.forEach(point => {
            texture.context.fillStyle = "rgb(0,0,0)";
            texture.context.fillRect(point.x * gridSize, point.y * gridSize, gridSize, gridSize);
        });

        texture.refresh();
        var image = this.add.image(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2, 'mapTexture');
        image.setOrigin(0.5, 0.5);
    }
}