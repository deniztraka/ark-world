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

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene"
        });
        this.controls = null;

        this.sys.settings.map.isoPlugin = "iso";
        this.sys.settings.map.isoPhysics = "isoPhysics";

        this.eventEmitter = new Phaser.Events.EventEmitter();
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
        this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

        this.map = null;
        this.mapLayers = null;

        this.tileStackData = {};
        this.isoGroup = this.add.group();

        // Apply some gravity on our cubes
        this.isoPhysics.world.gravity.setTo(0, 0, -500);
        this.isoPhysics.projector.origin.setTo(0.5, 0.5);

        var isoWorldData = new WorldData(1, 10, 10, 64, 64);
        isoWorldData.generate();
        isoWorldData.generateTreePositions();

        this.createWithCustomPlugin(isoWorldData);

        //this.createTexture(worldData, true);

        this.createPlayer();

    }

    createPlayer() {

        var ogre = new Player(this, 9, 9, this.isoGroup);


    }

    createWithCustomPlugin(worldData) {


        for (var x = 0; x < worldData.width; x++) {
            for (var y = 0; y < worldData.height; y++) {
                // Create a cube using the new isoSprite factory method at the specified position.
                var tile = this.add.isoSprite(x * worldData.cellHeight / 2, y * worldData.cellWidth / 2, 0, 'isoDirt', this.isoGroup);
                tile.tileData = {};
                tile.tileData.x = x;
                tile.tileData.y = y;
                tile.elevation = 0;

                this.isoPhysics.world.enable(tile);
                // tile.on('pointerover', function() {
                //     this.setTint(0x86bfda);
                //     this.isoZ += 5;
                // });

                // tile.on('pointerout', function() {
                //     this.clearTint();
                //     this.isoZ -= 5;
                // });
                //tile.setOrigin(0.5, 0.5);
                tile.setInteractive();
                tile.body.blocked = {
                    up: true,
                    down: true,
                    frontX: true,
                    frontY: true,
                    backX: true,
                    backY: true
                };
                tile.body.immovable = true;
                tile.body.allowGravity = true;


                for (let i = 1; i <= 5; i++) {

                    var elevation = worldData.getElevation(x, y, true);
                    if (i <= elevation) {
                        var elevationTile = this.add.isoSprite(x * worldData.cellHeight / 2, y * worldData.cellWidth / 2, i * worldData.cellHeight / 2, 'isoDirt', this.isoGroup);
                        //var tile = this.map.getTileAt(x, y, true, this.mapLayers.layer0);
                        elevationTile.tileData = {};
                        elevationTile.tileData.x = x;
                        elevationTile.tileData.y = y;
                        elevationTile.elevation = i;
                        this.isoPhysics.world.enable(elevationTile);

                        tile.hasElevationStack = true;
                        elevationTile.body.allowGravity = false;

                        elevationTile.setOrigin(0.5, 0.5);
                        elevationTile.setInteractive();

                        elevationTile.body.blocked = {
                            up: true,
                            down: true,
                            frontX: true,
                            frontY: true,
                            backX: true,
                            backY: true
                        };
                        elevationTile.body.immovable = true;

                        if (i == 0) {
                            elevationTile.tint = 0xffffff;
                        } else if (i == 1) {
                            elevationTile.tint = 0xdddddd;
                        } else if (i == 2) {
                            elevationTile.tint = 0xbbbbbb;
                        } else if (i == 3) {
                            elevationTile.tint = 0x999999;
                        } else if (i == 4) {
                            elevationTile.tint = 0x666666;
                        } else if (i == 5) {
                            elevationTile.tint = 0x333333;
                        }

                        if (!this.tileStackData[i]) {
                            this.tileStackData[i] = [];
                        }

                        this.tileStackData[i].push(elevationTile);
                        // Enable the physics body on this cube

                        elevationTile.body.collideWorldBounds = true;
                        elevationTile.body.bounce.set(0, 0, 0);

                        // elevationTile.on('pointerover', function() {
                        //     this.setTint(0x86bfda);
                        //     this.isoZ += 5;
                        // });

                        // elevationTile.on('pointerout', function() {
                        //     this.clearTint();
                        //     this.isoZ -= 5;
                        // });
                    }

                }

                if (!this.tileStackData["0"]) {
                    this.tileStackData["0"] = [];
                }

                this.tileStackData["0"].push(tile);
                //Enable the physics body on this cube

                tile.body.collideWorldBounds = true;
                tile.body.bounce.set(0, 0, 0);
            }
        }

        // debugger;
        // this.createPlayer();
    }

    update(time, delta) {
        this.controls.update(delta);
        this.eventEmitter.emit("gameSceneUpdate!", time, delta);
        this.isoPhysics.world.collide(this.isoGroup);
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