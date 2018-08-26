import { WorldData } from '../data/worldData';
import { Tree } from '../entities/tree';
import { Mountain } from '../entities/mountain';
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

        var worldData = new WorldData(1, 512, 512, 32, 32);
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
        var layer = map.createBlankDynamicLayer('layer', tiles);
        layer.setScrollFactor(1);


        for (var x = 0; x < worldData.width; x++) {
            for (var y = 0; y < worldData.height; y++) {
                var biome = worldData.getBiome(worldData.elevationData[x][y], worldData.moistureData[x][y]);
                map.putTileAt(biome.tileIndex, x, y, true, layer);
            }
        }

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