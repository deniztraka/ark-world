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
    Ogre
} from '../entities/mobiles/ogre';




export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene"
        });
        this.controls = null;

        this.sys.settings.map.isoPlugin = "iso";

        this.updateEmitter = new Phaser.Events.EventEmitter();
    }


    preload() {
        this.load.scenePlugin(
            'IsoPlugin',
            IsoPlugin,
            'iso',
            'iso'
        );
    }

    create() {

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
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

        this.map = null;
        this.mapLayers = null;

        var isoWorldData = new WorldData(1, 10, 10, 64, 64);
        isoWorldData.generate();
        isoWorldData.generateTreePositions();
        this.createIsoTileMap(isoWorldData);

        // var worldData = new WorldData(1, 10, 10, 32, 32);
        // worldData.generate();
        // worldData.generateTreePositions();
        // this.createTileMap(worldData);



        //this.createTexture(worldData, true);

        //console.table(worldData.elevationData);

        var ogre = new Ogre(this, 32, 16);

    }

    createWithCustomPlugin(worldData) {

        for (var x = 0; x < worldData.width; x++) {
            for (var y = 0; y < worldData.height; y++) {
                // Create a cube using the new isoSprite factory method at the specified position.
                var tile = this.add.isoSprite(x * worldData.cellHeight, y * worldData.cellHeight, 0, 'isoDirt');
                tile.setInteractive();

                tile.on('pointerover', function () {
                    this.setTint(0x86bfda);
                    //this.isoZ += 5;
                });

                tile.on('pointerout', function () {
                    this.clearTint();
                    //this.isoZ -= 5;
                });
            }
        }
    }

    update(time, delta) {
        this.controls.update(delta);
        this.updateEmitter.emit("update!");
    }


    createIsoTileMap(worldData) {
        var self = this;

        this.map = this.make.isoTileMap({
            tileWidth: worldData.cellWidth,
            tileHeight: worldData.cellHeight,
            width: worldData.width,
            height: worldData.height
        });

        var isoTiles = this.map.addTilesetImage('isoDirt');

        this.mapLayers = {
            layer0: self.map.createBlankDynamicIsoLayer('layer0', isoTiles),
            layer0object: self.map.createBlankDynamicIsoLayer('layer0object', isoTiles),
            layer1: self.map.createBlankDynamicIsoLayer('layer1', isoTiles),
            layer1object: self.map.createBlankDynamicIsoLayer('layer1object', isoTiles),
            layer2: self.map.createBlankDynamicIsoLayer('layer2', isoTiles),
            layer2object: self.map.createBlankDynamicIsoLayer('layer2object', isoTiles),
            layer3: self.map.createBlankDynamicIsoLayer('layer3', isoTiles),
            layer3object: self.map.createBlankDynamicIsoLayer('layer3object', isoTiles),
            layer4: self.map.createBlankDynamicIsoLayer('layer4', isoTiles),
            layer4object: self.map.createBlankDynamicIsoLayer('layer4object', isoTiles),
            layer5: self.map.createBlankDynamicIsoLayer('layer5', isoTiles),
            layer5object: self.map.createBlankDynamicIsoLayer('layer5object', isoTiles)
        };


        for (var x = 0; x < worldData.width; x++) {
            for (var y = 0; y < worldData.height; y++) {
                //map.putTileAt(0, x, y, true, layers.layer0);
                this.map.putTileAt(0, x, y, true, this.mapLayers.layer0);
            }
        }

        return;
        for (let i = 1; i <= 5; i++) {
            var currentLayer = this.mapLayers["layer" + i];

            for (var x = 0; x < worldData.width; x++) {
                for (var y = 0; y < worldData.height; y++) {
                    var elevation = worldData.getElevation(x, y, true);
                    if (i <= elevation) {
                        var tile = this.map.putTileAt(0, x, y, true, currentLayer);
                        tile.setHeight(i * worldData.cellHeight / 2);
                        if (i == 0) {
                            tile.tint = 0xffffff;
                        } else if (i == 1) {
                            tile.tint = 0xdddddd;
                        } else if (i == 2) {
                            tile.tint = 0xbbbbbb;
                        } else if (i == 3) {
                            tile.tint = 0x999999;
                        } else if (i == 4) {
                            tile.tint = 0x666666;
                        } else if (i == 5) {
                            tile.tint = 0x333333;
                        }
                    }
                }
            }
        }

        this.input.on('pointerdown', function () {
            self.logTile();
        });


        
        //this.mapLayers.layer1.enableMarker(self);
    }

    logTile() {
        var worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);
        var tileIndexPointer = this.mapLayers.layer0.worldToTileXY(worldPoint.x, worldPoint.y, false);
        if (tileIndexPointer) {
            var tile = this.map.getTileAt(tileIndexPointer.x, tileIndexPointer.y, true, this.mapLayers.layer0);
            //tile.setHeight(tile.z + 16);
            console.log(tile);
            // var tileDeleted = this.map.removeTileAt(tileIndexPointer.x, tileIndexPointer.y, false, true, this.mapLayers.layer0);
            // console.log(tileDeleted);
            // var newTile = this.map.putTileAt(tileDeleted.index, tileIndexPointer.x, tileIndexPointer.y, true, this.mapLayers.layer1);
            // newTile.setHeight(32);
            // console.log(newTile);

        }
    }

    createTileMap(worldData) {
        var self = this;

        this.map = this.make.tilemap({
            tileWidth: worldData.cellWidth,
            tileHeight: worldData.cellHeight,
            width: worldData.width,
            height: worldData.height
        });
        var tiles = this.map.addTilesetImage('real_tiles_extended');
        this.mapLayers = {
            layer0: self.map.createBlankDynamicLayer('layer0', tiles),
            layer0object: self.map.createBlankDynamicLayer('layer0object', tiles),
            layer1: self.map.createBlankDynamicLayer('layer1', tiles),
            layer1object: self.map.createBlankDynamicLayer('layer1object', tiles),
            layer2: self.map.createBlankDynamicLayer('layer2', tiles),
            layer2object: self.map.createBlankDynamicLayer('layer2object', tiles),
            layer3: self.map.createBlankDynamicLayer('layer3', tiles),
            layer3object: self.map.createBlankDynamicLayer('layer3object', tiles),
            layer4: self.map.createBlankDynamicLayer('layer4', tiles),
            layer4object: self.map.createBlankDynamicLayer('layer4object', tiles),
            layer5: self.map.createBlankDynamicLayer('layer5', tiles),
            layer5object: self.map.createBlankDynamicLayer('layer5object', tiles)
        };

        //return;
        for (var x = 0; x < worldData.width; x++) {
            for (var y = 0; y < worldData.height; y++) {

                var biome = worldData.getBiome(worldData.elevationData[x][y], worldData.moistureData[x][y]);

                var baseElevation = worldData.getElevation(x, y, true);
                this.map.putTileAt(biome.tileIndex, x, y, true, this.mapLayers["layer" + baseElevation]);

                //continue;
                //generating height tiles
                for (let i = 0; i < baseElevation; i++) {

                    var brick = new Brick(this, (x * worldData.cellWidth) + (worldData.cellWidth / 2), (y * worldData.cellHeight) + (worldData.cellHeight / 2) - i * worldData.cellHeight);

                    if (i == 0) {
                        brick.setTint(0xffffff);
                    } else if (i == 1) {
                        brick.setTint(0xdddddd);
                    } else if (i == 2) {
                        brick.setTint(0xbbbbbb);
                    } else if (i == 3) {
                        brick.setTint(0x999999);
                    } else if (i == 4) {
                        brick.setTint(0x666666);
                    } else if (i == 5) {
                        brick.setTint(0x333333);
                    }
                }

            }
        }

        // worldData.treePositions.forEach(position => {
        //     new Tree(this, (position.x * worldData.cellWidth) + worldData.cellWidth / 2, (position.y * worldData.cellHeight) + worldData.cellHeight / 2);
        // });

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
            texture.context.fillStyle = "rgb(0,0,0)"
            texture.context.fillRect(point.x * gridSize, point.y * gridSize, gridSize, gridSize);
        });

        texture.refresh();
        var image = this.add.image(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2, 'mapTexture');
        image.setOrigin(0.5, 0.5);
    }
}