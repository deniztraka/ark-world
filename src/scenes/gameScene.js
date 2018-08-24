import {
    Noise
} from 'noisejs';

import {
    libnoise
} from 'libnoise';

import PoissonDiskSampling from 'poisson-disk-sampling'

export class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene"
        });
        this.controls = null;
        this.mapSize = 512;
        this.defaultMinVal = 0;
        this.defaultMaxVal = 0;
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

        var noiseDataArray = this.createNoiseArray(false, 0.001, 2, 0.5, 6, this.time.now, libnoise.QualityMode.LOW);
        noiseDataArray = this.normalizeValues(noiseDataArray);

        var moistureDataArray = this.createNoiseArray(false, 0.001, 2.0, 0.5, 6, this.time.now + 1231232, libnoise.QualityMode.LOW);
        moistureDataArray = this.normalizeValues(moistureDataArray);

        this.createTexture(noiseDataArray, moistureDataArray, true);

        //this.createTileMap(noiseDataArray);

        //console.table(noiseDataArray);

    }

    update(time, delta) {
        this.controls.update(delta);
    }

    createTileMap(noiseDataArray) {

        var map = this.make.tilemap({
            tileWidth: 32,
            tileHeight: 32,
            width: this.mapSize,
            height: this.mapSize
        });
        var tiles = map.addTilesetImage('base_tiles');
        var layer = map.createBlankDynamicLayer('layer', tiles);
        layer.cullPaddingX = -1;
        layer.cullPaddingY = -1;
        layer.setScrollFactor(1);


        for (var x = 0; x < this.mapSize; x++) {
            for (var y = 0; y < this.mapSize; y++) {
                if (noiseDataArray[x][y] < 0.4) {
                    map.putTileAt(0, x, y, true, layer); //deep blue
                } else if (noiseDataArray[x][y] < 0.5) {
                    map.putTileAt(1, x, y, true, layer); //blue
                } else if (noiseDataArray[x][y] < 0.52) {
                    map.putTileAt(2, x, y, true, layer); //yellow
                } else if (noiseDataArray[x][y] < 0.675) {
                    map.putTileAt(3, x, y, true, layer); //green
                } else if (noiseDataArray[x][y] < 0.8) {
                    map.putTileAt(5, x, y, true, layer); //gray
                } else if (noiseDataArray[x][y] <= 1) {
                    map.putTileAt(6, x, y, true, layer); //white
                }
            }
        }
    }

    createTexture(noiseDataArray, moistureDataArray, useColor) {
        var self = this;
        var gridSize = 1;

        var DEEPSEA = "rgb(60,60,102)";
        var SEA = "rgb(68,68,122)";
        var BEACH = "rgb(160,144,119)";
        var SCORCHED = "rgb(85,85,85)";
        var BARE = "rgb(136,136,136)";
        var TUNDRA = "rgb(187,187,170)";
        var SNOW = "rgb(221,221,221)";
        var TEMPERATE_DESERT = "rgb(201,210,155)";
        var SHRUBLAND = "rgb(136,153,119)";
        var TAIGA = "rgb(153,170,119)";
        var GRASSLAND = "rgb(136,170,85)";
        var TEMPERATE_DECIDUOUS_FOREST = "rgb(103,148,89)";
        var TEMPERATE_RAIN_FOREST = "rgb(68,136,85)";
        var SUBTROPICAL_DESERT = "rgb(210,185,139)";
        var TROPICAL_SEASONAL_FOREST = "rgb(85,153,68)";
        var TROPICAL_RAIN_FOREST = "rgb(51,119,85)";

        var texture = this.textures.createCanvas('mapTexture', this.mapSize * gridSize, this.mapSize * gridSize);
        for (var x = 0; x < this.mapSize; x++) {
            for (var y = 0; y < this.mapSize; y++) {
                texture.context.fillStyle = this.getBiome(noiseDataArray[x][y], moistureDataArray[x][y], useColor);

                texture.context.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
            }
        }

        var treePlacementPointsForTropicalRainForest = new PoissonDiskSampling([this.mapSize, this.mapSize], 2, 10, 10);
        var points = treePlacementPointsForTropicalRainForest.fill();
        points.forEach(point => {
            var biome = self.getBiome(noiseDataArray[Math.floor(point[0])][Math.floor(point[1])], moistureDataArray[Math.floor(point[0])][Math.floor(point[1])], useColor);
            if (biome == TROPICAL_RAIN_FOREST) {
                texture.context.fillStyle = "rgb(0,0,0)"

                texture.context.fillRect(Math.floor(point[0]) * gridSize, Math.floor(point[1]) * gridSize, gridSize, gridSize);
            }
        });

        var treePlacementPointsForTemperateDesert = new PoissonDiskSampling([this.mapSize, this.mapSize], 15, 30, 10);
        var pointsx = treePlacementPointsForTemperateDesert.fill();
        pointsx.forEach(point => {
            var biome = self.getBiome(noiseDataArray[Math.floor(point[0])][Math.floor(point[1])], moistureDataArray[Math.floor(point[0])][Math.floor(point[1])], useColor);
            if (biome == TEMPERATE_DESERT) {
                texture.context.fillStyle = "rgb(0,0,0)"

                texture.context.fillRect(Math.floor(point[0]) * gridSize, Math.floor(point[1]) * gridSize, gridSize, gridSize);
            }
        });



        texture.refresh();
        var image = this.add.image(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2, 'mapTexture');
        image.setOrigin(0.5, 0.5);
    }

    createNoiseArray(useIslandMap, frequency, lacunarity, persistence, octaves, seed, quality) {
        //noise
        var noiseDataArray = [...Array(this.mapSize)].map(x => Array(this.mapSize).fill(0));


        //scale: number that determines at what distance to view the noisemap.
        //octaves: the number of levels of detail you want you perlin noise to have.
        //lacunarity: number that determines how much detail is added or removed at each octave (adjusts frequency).
        //persistence: number that determines how much each octave contributes to the overall shape (adjusts amplitude).

        //Perlin(frequency, lacunarity, persistence, octaves, quality)
        //var noise = new libnoise.generator.Perlin(.01, 2.0, 0.5, 8, "deniz", libnoise.QualityMode.LOW);
        //var noise = new libnoise.generator.Perlin(.01, 2.0, .6, 10, this.time.now, libnoise.QualityMode.LOW); //THİS İS WHAT I WANT
        //var noise = new libnoise.generator.Perlin(.01, 2.0, 0.5, 6, "deniz", libnoise.QualityMode.LOW);

        var noise = new libnoise.generator.Perlin(frequency, lacunarity, persistence, octaves, seed, quality);

        var frequency = 10;
        var power = 1.001;


        var a = 0.04;
        var b = 1.06;
        var c = 2.20;
        var d = 1;

        var amplitude = 2;

        for (var x = 0; x < this.mapSize; x++) {
            for (var y = 0; y < this.mapSize; y++) {
                var noiseVal = noise.getValue(x * frequency, y * frequency, 0);
                //noiseVal = noiseVal * amplitude;
                //noiseVal = Math.pow(noiseVal, power);            

                if (noiseVal > this.defaultMaxVal) {
                    this.defaultMaxVal = noiseVal;
                }

                if (noiseVal < this.defaultMinVal) {
                    this.defaultMinVal = noiseVal;
                }

                noiseDataArray[x][y] = noiseVal;
            }
        }

        //this is not finished yet. it is not working well.
        if (useIslandMap) {
            for (var x = 0; x < this.mapSize; x++) {
                for (var y = 0; y < this.mapSize; y++) {

                    var distanceX = (this.mapSize / 2 - x) * (this.mapSize / 2 - x);
                    var distanceY = (this.mapSize / 2 - y) * (this.mapSize / 2 - y);

                    var distanceToCenter = Math.sqrt(distanceX + distanceY);
                    distanceToCenter = distanceToCenter / this.mapSize;
                    distanceToCenter = ((distanceToCenter - 0.5) * 2);
                    debugger;
                    // if (distanceToCenter > 0.3){
                    //     noiseDataArray[x][y] *= -0.1;
                    // }

                    noiseDataArray[x][y] = noiseDataArray[x][y] * distanceToCenter;
                }
            }
        }

        console.log(this.defaultMinVal + "," + this.defaultMaxVal);

        return noiseDataArray;
    }

    normalizeValues(noiseDataArray) {

        var normalizedMinVal = 0;
        var normalizedMaxVal = 0;

        //normalize
        for (var x = 0; x < this.mapSize; x++) {
            for (var y = 0; y < this.mapSize; y++) {

                noiseDataArray[x][y] = (noiseDataArray[x][y] - this.defaultMinVal) / (this.defaultMaxVal - this.defaultMinVal);

                if (noiseDataArray[x][y] > normalizedMaxVal) {
                    normalizedMaxVal = noiseDataArray[x][y];
                }

                if (noiseDataArray[x][y] < normalizedMinVal) {
                    normalizedMinVal = noiseDataArray[x][y];
                }
            }
        }

        console.log(normalizedMinVal + "," + normalizedMaxVal);

        return noiseDataArray;
    }

    generateHexColor(x) {
        return '#' + ((0.5 + 0.5 * x) * 0xFFFFFF << 0).toString(16);
    }

    getBiome(e, m, useColor) {

        var DEEPSEA = "rgb(60,60,102)";
        var SEA = "rgb(68,68,122)";
        var BEACH = "rgb(160,144,119)";
        var SCORCHED = "rgb(85,85,85)";
        var BARE = "rgb(136,136,136)";
        var TUNDRA = "rgb(187,187,170)";
        var SNOW = "rgb(221,221,221)";
        var TEMPERATE_DESERT = "rgb(201,210,155)";
        var SHRUBLAND = "rgb(136,153,119)";
        var TAIGA = "rgb(153,170,119)";
        var GRASSLAND = "rgb(136,170,85)";
        var TEMPERATE_DECIDUOUS_FOREST = "rgb(103,148,89)";
        var TEMPERATE_RAIN_FOREST = "rgb(68,136,85)";
        var SUBTROPICAL_DESERT = "rgb(210,185,139)";
        var TROPICAL_SEASONAL_FOREST = "rgb(85,153,68)";
        var TROPICAL_RAIN_FOREST = "rgb(51,119,85)";



        if (useColor) {
            if (e < 0.4) return DEEPSEA; // 0.1
            if (e < 0.5) return SEA; // 0.1
            if (e < 0.52) return BEACH; // 0.12

            if (e > 0.77) { // 0.8
                if (m < 0.5) return SCORCHED; // 0.1
                if (m < 0.55) return BARE; // 0.2
                if (m < 0.6) return TUNDRA; // 0.5
                return SNOW;
            }

            if (e > 0.7) { // 0.6
                if (m < 0.625) return TEMPERATE_DESERT; // 0.33
                if (m < 0.8) return SHRUBLAND; // 0.66
                return TAIGA;
            }

            if (e > 0.58) { // 0.3 
                if (m < 0.54) return TEMPERATE_DESERT; // 0.16
                if (m < 0.675) return GRASSLAND; // 0.50
                if (m < 0.8) return TEMPERATE_DECIDUOUS_FOREST; //0.83
                return TEMPERATE_RAIN_FOREST;
            }

            if (m < 0.54) return SUBTROPICAL_DESERT; // 0.16
            if (m < 0.625) return GRASSLAND; // 0.33
            if (m < 0.675) return TROPICAL_SEASONAL_FOREST; // 0.66
            return TROPICAL_RAIN_FOREST;

        }






        // if (useColor) {
        //     if (x < 0.4) {
        //         return "rgb(" + 0 + ", " + 51 + ", " + 102 + ")"; //deep blue
        //     } else if (x < 0.5) {
        //         return "rgb(" + 0 + ", " + 102 + ", " + 204 + ")"; //blue
        //     } else if (x < 0.52) {
        //         return "rgb(" + 255 + ", " + 255 + ", " + 153 + ")"; //yellow
        //     } else if (x < 0.675) {
        //         return "rgb(" + 76 + ", " + 153 + ", " + 0 + ")"; //green
        //     } else if (x < 0.8) {
        //         return "rgb(" + 128 + ", " + 128 + ", " + 128 + ")"; //gray
        //     } else if (x <= 1) {
        //         return "rgb(" + 255 + ", " + 255 + ", " + 255 + ")"; //white
        //     }
        // }

        var color = Math.round((255 * e));
        return "rgb(" + color + ", " + color + ", " + color + ")";
    }
}