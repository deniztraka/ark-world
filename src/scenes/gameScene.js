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




export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene"
        });
        this.controls = null;

        this.sys.settings.map.isoPlugin = "iso";
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
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            speed: 1,
            zoomIn: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
            zoomOut: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        };
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

        var isoWorldData = new WorldData(1, 10, 10, 64, 32);
        isoWorldData.generate();
        isoWorldData.generateTreePositions();
        this.createIsoTileMap(isoWorldData);

        var worldData = new WorldData(1, 10, 10, 32, 32);
        worldData.generate();
        worldData.generateTreePositions();
        this.createTileMap(worldData);

        //this.createTexture(worldData, true);




        //this.createWithCustomPlugin(worldData);



        //console.table(worldData.elevationData);



        debugger;

    }

    createWithCustomPlugin(worldData) {

        debugger;
        for (var x = 0; x < worldData.width; x++) {
            for (var y = 0; y < worldData.height; y++) {
                // Create a cube using the new isoSprite factory method at the specified position.
                var tile = this.add.isoSprite(x * worldData.cellHeight, y * worldData.cellHeight, 0, 'isoDirt');
                tile.setInteractive();

                tile.on('pointerover', function() {
                    this.setTint(0x86bfda);
                    //this.isoZ += 5;
                });

                tile.on('pointerout', function() {
                    this.clearTint();
                    //this.isoZ -= 5;
                });
            }
        }
    }

    update(time, delta) {
        this.controls.update(delta);
    }


    createIsoTileMap(worldData) {
        var self = this;

        var map = this.make.isoTileMap({
            tileWidth: worldData.cellWidth,
            tileHeight: worldData.cellHeight,
            width: worldData.width,
            height: worldData.height
        });

        var isoTiles = map.addTilesetImage('isoDirt');

        var layers = {
            layer0: map.createBlankDynamicIsoLayer('layer0', isoTiles)
        };

        debugger;

        for (var x = 0; x < worldData.width; x++) {
            for (var y = 0; y < worldData.height; y++) {

                map.putTileAt(0, x, y, true, layers.layer0);
                if (x == 1 && y == 6) {
                    layers.layer0.layer.data[x][y].z = 5;
                }


            }
        }

        this.input.on('pointerdown', function() {
            var worldPoint = self.input.activePointer.positionToCamera(self.cameras.main);
            var tileIndexPointer = layers.layer0.worldToTileXY(worldPoint.x, worldPoint.y, false);
            var tile = map.getTileAt(tileIndexPointer.x, tileIndexPointer.y, true, layers.layer0);

            console.log(tile);

        });

        layers.layer0.enableMarker(self);
    }

    createTileMap(worldData) {
        var map = this.make.tilemap({
            tileWidth: worldData.cellWidth,
            tileHeight: worldData.cellHeight,
            width: worldData.width,
            height: worldData.height
        });
        var tiles = map.addTilesetImage('real_tiles_extended');
        var layers = {
            layer0: map.createBlankDynamicLayer('layer0', tiles),
            layer0object: map.createBlankDynamicLayer('layer0object', tiles),
            layer1: map.createBlankDynamicLayer('layer1', tiles),
            layer1object: map.createBlankDynamicLayer('layer1object', tiles),
            layer2: map.createBlankDynamicLayer('layer2', tiles),
            layer2object: map.createBlankDynamicLayer('layer2object', tiles),
            layer3: map.createBlankDynamicLayer('layer3', tiles),
            layer3object: map.createBlankDynamicLayer('layer3object', tiles),
            layer4: map.createBlankDynamicLayer('layer4', tiles),
            layer4object: map.createBlankDynamicLayer('layer4object', tiles),
            layer5: map.createBlankDynamicLayer('layer5', tiles),
            layer5object: map.createBlankDynamicLayer('layer5object', tiles)
        };

        //return;
        for (var x = 0; x < worldData.width; x++) {
            for (var y = 0; y < worldData.height; y++) {
                var biome = worldData.getBiome(worldData.elevationData[x][y], worldData.moistureData[x][y]);
                var baseElevation = Math.floor(worldData.elevationData[x][y] * 10) - 5; //because seaa is lower than elevation 5 so we start at 1;
                if (baseElevation < 0) {
                    baseElevation = 0;
                }
                map.putTileAt(biome.tileIndex, x, y, true, layers["layer" + baseElevation]);

                continue;
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