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
        this.eventEmitter.on("playerPositionChanged!", function (newIsoTileData) {
            self.cullMap(newIsoTileData);
        });

        this.renderSize = 10;
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


        this.worldData = new WorldData(4, 100, 100, 16, 16);
        this.worldData.generate();
        this.worldData.generateTreePositions();
        //this.createTexture(worldData, true);
        this.createWorld();

        this.createPlayer();

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

    }

    update(time, delta) {
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
            tileWidth: this.worldData.cellWidth,
            tileHeight: this.worldData.cellHeight,
            width: this.worldData.width,
            height: this.worldData.height
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
        for (var x = 0; x < this.worldData.width; x++) {
            for (var y = 0; y < this.worldData.height; y++) {

                var currentBiome = this.worldData.getBiome(this.worldData.elevationData[x][y], this.worldData.moistureData[x][y]);

                var baseElevation = this.worldData.getElevation(x, y, true);
                var tile = this.map.putTileAt(currentBiome.tileIndex, x, y, true, this.mapLayers["layer0"]);
                tile.properties.biome = currentBiome;
                tile.properties.biomeName = currentBiome.name;
                tile.properties.baseElevation = baseElevation;

                if (baseElevation == 5) {
                    tile.tint = 0xffffff;
                } else if (baseElevation == 4) {
                    tile.tint = 0xeeeeee;
                } else if (baseElevation == 3) {
                    tile.tint = 0xdddddd;
                } else if (baseElevation == 2) {
                    tile.tint = 0xcccccc;
                } else if (baseElevation == 1) {
                    tile.tint = 0xcccccc;
                } else if (baseElevation == 0) {
                    tile.tint = 0xcccccc;
                }
            }
        }

        this.mapLayers["layer0"].setCollisionByProperty({
            biomeName: ["Sea", "DeepSea"],
            baseElevation: [5, 4, 3]
        });

        //tree placement
        this.worldData.treePositions.forEach(point => {
            var currentBiome = self.worldData.getBiome(self.worldData.elevationData[point.x][point.y], self.worldData.moistureData[point.x][point.y]);
            var tree = new Tree(self, point.x * self.worldData.cellWidth + self.worldData.cellWidth / 2, point.y * self.worldData.cellHeight + self.worldData.cellHeight, currentBiome);
        });
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