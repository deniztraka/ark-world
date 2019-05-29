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
    Player
} from '../entities/mobiles/basicPlayer';

import * as IsoTileHelper from '../core/tilemap/isoTileHelper';

export class GameScene extends Phaser.Scene {
    constructor() {

        super({
            key: "GameScene"
        });
        this.controls = null;

        var self = this;
        this.eventEmitter = new Phaser.Events.EventEmitter();
        this.eventEmitter.on("playerPositionChanged!", function(newIsoTileData) {
            self.cullMap(newIsoTileData);
        });

        this.renderSize = 10;

        this.shadows = [];
        this.staticMapData = null;
    }

    init(obj) {
        console.log("asd");
        var self = this;
        this.staticMapData = obj.data;
        this.socket = obj.socket;

        this.socket.on("disconnect", function() {
            self.scene.start("LoginScreen");
        });
    }

    preload() {

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

        if (this.staticMapData) {
            this.createWorld();
            this.createPlayer();
        }

        var help = this.add.text(16, 16, 'W/A/S/D to keys to move', {
            fontSize: '18px',
            padding: {
                x: 10,
                y: 5
            },
            backgroundColor: '#ffffff',
            fill: '#000000'
        });

        help.setScrollFactor(0);

        this.input.on('pointerdown', function(pointer) {


            var tile = this.map.getTileAtWorldXY(pointer.x, pointer.y, true, this.cam, this.mapLayers["layer0"]);
            console.log(tile.x + "," + tile.y + " " + tile.properties.biome.name + " index:" + tile.index + " elevation:" + tile.properties.elevation);


        }, this);


        var titleText = this.add.text(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2 - 15, '', {
            fontWeight: "bold",
            font: '30px Courier',
            fill: '#ffffff'
        });
        titleText.setOrigin(0.5, 0.5);
        titleText.setText("Fight!");
    }

    update(time, delta) {
        var self = this;

        if (this.controls) {
            this.controls.update(delta);
        }
        this.eventEmitter.emit("gameSceneUpdate!", time, delta);
    }

    createPlayer() {
        this.player = new Player(this, 0, 10);
    }

    createWorld() {
        var self = this;

        this.map = this.make.tilemap({
            tileWidth: self.staticMapData.cellWidth,
            tileHeight: self.staticMapData.cellHeight,
            width: self.staticMapData.width,
            height: self.staticMapData.height
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

        for (var x = 0; x < self.staticMapData.width; x++) {
            for (var y = 0; y < self.staticMapData.height; y++) {
                var tile = this.map.putTileAt(self.staticMapData.tileData[x][y].index, x, y, true, this.mapLayers["layer0"]);
                tile.properties.biome = {
                    name: self.staticMapData.tileData[x][y].name
                };
                tile.properties = {
                    biome: {
                        name: self.staticMapData.tileData[x][y].name
                    },
                    elevation: self.staticMapData.tileData[x][y].elevation
                };

                if (tile.properties.elevation == 5) {
                    tile.tint = 0xffffff;
                } else if (tile.properties.elevation == 4) {
                    tile.tint = 0xeeeeee;
                } else if (tile.properties.elevation == 3) {
                    tile.tint = 0xdddddd;
                } else if (tile.properties.elevation == 2) {
                    tile.tint = 0xcccccc;
                } else if (tile.properties.elevation == 1) {
                    tile.tint = 0xcccccc;
                } else if (tile.properties.elevation == 0) {
                    tile.tint = 0xcccccc;
                }
            }
        }

        this.mapLayers["layer0"].setCollision(self.staticMapData.collisionIndexes);

        this.updateShadows();

    }

    updateShadows() {
        var self = this;
        var shadowTiles = [];
        var shadowFillStyle = "rgba(0,0,0,0.1)";

        for (var x = 0; x < self.staticMapData.width; x++) {
            for (var y = 0; y < self.staticMapData.height; y++) {

                var tile = self.map.getTileAt(x, y, false, self.mapLayers["layer0"]);

                var leftTile = self.map.getTileAt(x - 1, y, false, self.mapLayers["layer0"]);
                var rightTile = self.map.getTileAt(x + 1, y, false, self.mapLayers["layer0"]);
                var topTile = self.map.getTileAt(x, y - 1, false, self.mapLayers["layer0"]);
                var bottomTile = self.map.getTileAt(x, y + 1, false, self.mapLayers["layer0"]);

                if (tile.canCollide || tile.properties.biome.name == "Snow") {
                    shadowTiles.push({
                        centerX: tile.getCenterX(),
                        centerY: tile.getCenterY(),
                        left: tile.getLeft(),
                        right: tile.getRight(),
                        top: tile.getTop(),
                        bottom: tile.getBottom(),
                        faceLeft: tile.faceLeft || (leftTile != null && leftTile.properties.elevation < tile.properties.elevation),
                        faceRight: tile.faceRight || (rightTile != null && rightTile.properties.elevation < tile.properties.elevation),
                        faceBottom: tile.faceBottom || (bottomTile != null && bottomTile.properties.elevation < tile.properties.elevation),
                        faceTop: tile.faceTop || (topTile != null && topTile.properties.elevation < tile.properties.elevation),
                        hasShadow: !(tile.properties.biome.name === "Sea" || tile.properties.biome.name === "DeepSea" || tile.properties.biome.name === "River")
                    });
                }
            }
        }
        this.textures.remove("shadowTexture");

        var shadowTexture = this.textures.createCanvas('shadowTexture', this.staticMapData.width * 16, this.staticMapData.height * 16);
        shadowTiles.forEach(tileShadowInfo => {
            if (tileShadowInfo.hasShadow) {
                if (tileShadowInfo.faceLeft) {
                    shadowTexture.context.fillStyle = shadowFillStyle;
                    shadowTexture.context.fillRect(tileShadowInfo.left - 4, tileShadowInfo.top, 4, 16);
                }

                if (tileShadowInfo.faceRight) {
                    shadowTexture.context.fillStyle = shadowFillStyle;
                    shadowTexture.context.fillRect(tileShadowInfo.left + 16, tileShadowInfo.top, 4, 16);
                }

                if (tileShadowInfo.faceBottom) {
                    shadowTexture.context.fillStyle = shadowFillStyle;
                    shadowTexture.context.fillRect(tileShadowInfo.left, tileShadowInfo.top + 16, 16, 4);
                }

                if (tileShadowInfo.faceTop) {
                    shadowTexture.context.fillStyle = shadowFillStyle;
                    shadowTexture.context.fillRect(tileShadowInfo.left, tileShadowInfo.top - 4, 16, 4);
                }
            }
        });
        shadowTexture.refresh();
        var shadowImg = this.add.image(0, 0, 'shadowTexture');
        shadowImg.setOrigin(0, 0);
    }

    createTexture(worldData, useColor) {
        var gridSize = 8;

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