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
} from '../data/biomes'


export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene"
        });
        this.controls = null;
    }

    preload() {

    }

    create() {
        var cursors = this.input.keyboard.createCursorKeys();
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

        var worldData = new WorldData(4, 50, 50, 32, 32);
        worldData.generate();
        worldData.generateTreePositions();

        //this.createTexture(worldData, true);

        this.createTileMap(worldData);

        //console.table(noiseDataArray);

    }

    update(time, delta) {
        this.controls.update(delta);
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
            layer1: map.createBlankDynamicLayer('layer1', tiles),
            layer2: map.createBlankDynamicLayer('layer2', tiles),
            layer3: map.createBlankDynamicLayer('layer3', tiles),
            layer4: map.createBlankDynamicLayer('layer4', tiles),
            layer5: map.createBlankDynamicLayer('layer5', tiles)
        };

        layers.layer1.setScrollFactor(1);




        for (var x = 0; x < worldData.width; x++) {
            for (var y = 0; y < worldData.height; y++) {
                var biome = worldData.getBiome(worldData.elevationData[x][y], worldData.moistureData[x][y]);
                var baseElevation = Math.floor(worldData.elevationData[x][y] * 10) - 5; //because seaa is lower than elevation 5 so we start at 1;
                if (baseElevation < 0) {
                    baseElevation = 0;
                }
                map.putTileAt(biome.tileIndex, x, y, true, layers["layer" + baseElevation]);

                //continue;
                //generating height tiles
                for (let i = 0; i < baseElevation; i++) {

                    var brick = new Brick(this, (x * worldData.cellWidth), (y * worldData.cellHeight) - (i * 16));
                    brick.depth = baseElevation*10;
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
                    //brick.setAlpha(0.5);
                }

            }
        }

        // layers.layer1.setDepth(5);
        // layers.layer1.setDepth(6);
        // layers.layer2.setDepth(7);
        // layers.layer3.setDepth(8);
        // layers.layer4.setDepth(9);
        // layers.layer5.setDepth(10);

        // // layers.layer0.depth = 0;
        // //  layers.layer1.depth = 1;
        // layers.layer2.tint = "#999999";
        // layers.layer3.tint = "#bbbbbb";
        // layers.layer4.tint = "#dddddd";
        // layers.layer5.tint = "#ffffff";

        worldData.treePositions.forEach(position => {
            new Tree(this, (position.x * worldData.cellWidth) + worldData.cellWidth / 2, (position.y * worldData.cellHeight) + worldData.cellHeight / 2);
        });

        //place mountains
        // for (var x = 0; x < worldData.width; x++) {
        //     for (var y = 0; y < worldData.height; y++) {
        //         var biome = worldData.getBiome(worldData.elevationData[x][y], worldData.moistureData[x][y]);
        //         if(biome.tileIndex == Biomes.Scorched.tileIndex){
        //             new Mountain(this, (x * worldData.cellWidth), (y * worldData.cellHeight));  
        //         } else if (biome.tileIndex == Biomes.Snow.tileIndex){
        //             var snowyMountain = new Mountain(this, (x * worldData.cellWidth) + worldData.cellWidth / 2, (y * worldData.cellHeight) - worldData.cellHeight / 2);  
        //             snowyMountain.setTexture("snowyMountains");
        //         }
        //     }
        // }
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