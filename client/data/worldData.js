import {
    libnoise
} from 'libnoise';

import {
    Biomes
} from './biomes'

import PoissonDiskSampling from 'poisson-disk-sampling'

export class WorldData {
    constructor(seed, width, height, cellWidth, cellHeight) {
        this.seed = seed;
        this.width = width;
        this.height = height;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.elevationData = [...Array(this.width)].map(x => Array(this.height).fill(0));
        this.moistureData = [...Array(this.width)].map(x => Array(this.height).fill(0));
        this.treePositions = [];
        this.defaultWorldNoiseMinVal = 0;
        this.defaultWorldNoiseMaxVal = 0;
        this.normalizedWorldNoiseMinVal = 0;
        this.normalizedWorldNoiseMaxVal = 0;
        this.defaultWorldMoistureMinVal = 0;
        this.defaultWorldMoistureMaxVal = 0;
        this.normalizedWorldMoistureMinVal = 0;
        this.normalizedWorldMoistureMaxVal = 0;
    }

    generate(seed) {
        if (seed) {
            this.seed = seed;
        }
        this.generateWith(0.001, 2, 0.5, 6, libnoise.QualityMode.HIGH, this.seed);
    }

    generateWith(frequency, lacunarity, persistence, octaves, quality, seed) {
        if (seed) {
            this.seed = seed;
        }

        var worldNoise = new libnoise.generator.Perlin(frequency, lacunarity, persistence, octaves, this.seed, quality);

        //filling noiseData
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var noiseVal = worldNoise.getValue(x * 10, y * 10, 0);

                if (noiseVal > this.defaultWorldNoiseMaxVal) {
                    this.defaultWorldNoiseMaxVal = noiseVal;
                }

                if (noiseVal < this.defaultWorldNoiseMinVal) {
                    this.defaultWorldNoiseMinVal = noiseVal;
                }

                this.elevationData[x][y] = noiseVal;
            }
        }

        //normalize
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {

                this.elevationData[x][y] = (this.elevationData[x][y] - this.defaultWorldNoiseMinVal) / (this.defaultWorldNoiseMaxVal - this.defaultWorldNoiseMinVal);

                if (this.elevationData[x][y] > this.normalizedWorldNoiseMaxVal) {
                    this.normalizedWorldNoiseMaxVal = this.elevationData[x][y];
                }

                if (this.elevationData[x][y] < this.normalizedWorldNoiseMinVal) {
                    this.normalizedWorldNoiseMinVal = this.elevationData[x][y];
                }
            }
        }


        var moistureNoise = new libnoise.generator.Perlin(frequency * 0.5, lacunarity, persistence, octaves, this.seed + 1231232, quality);

        //filling mouisture data
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var noiseVal = moistureNoise.getValue(x * 10, y * 10, 0);

                if (noiseVal > this.defaultWorldMoistureMaxVal) {
                    this.defaultWorldMoistureMaxVal = noiseVal;
                }

                if (noiseVal < this.defaultWorldMoistureMinVal) {
                    this.defaultWorldMoistureMinVal = noiseVal;
                }

                this.moistureData[x][y] = noiseVal;
            }
        }

        //normalize
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {

                this.moistureData[x][y] = (this.moistureData[x][y] - this.defaultWorldMoistureMinVal) / (this.defaultWorldMoistureMaxVal - this.defaultWorldMoistureMinVal);

                if (this.moistureData[x][y] > this.normalizedWorldMoistureMaxVal) {
                    this.normalizedWorldMoistureMaxVal = this.moistureData[x][y];
                }

                if (this.moistureData[x][y] < this.normalizedWorldMoistureMinVal) {
                    this.normalizedWorldMoistureMinVal = this.moistureData[x][y];
                }
            }
        }
    }

    generateTreePositions() {
        var self = this;
        for (var biome in Biomes) {
            var biomeObj = Biomes[biome];

            if (biomeObj.treePlacement.enabled) {
                var treePlacement = biomeObj.treePlacement;
                var biomePointSampling = new PoissonDiskSampling([self.width, self.height], treePlacement.minDistance, treePlacement.maxDistance);
                var biomePoints = biomePointSampling.fill();
                biomePoints.forEach(point => {
                    var posX = Math.floor(point[0]);
                    var posY = Math.floor(point[1]);

                    var currentPositionBiome = self.getBiome(self.elevationData[posX][posY], self.moistureData[posX][posY]);
                    if (biomeObj == currentPositionBiome) {
                        var treePosition = {
                            x: posX,
                            y: posY
                        };

                        self.treePositions.push(treePosition);
                    }
                });
            }
        }
    }

    getBiome(elevation, moisture) {

        if (elevation < 0.4) return Biomes.DeepSea; // 0.1 0.4
        if (elevation < 0.5) return Biomes.Sea; // 0.1 0.5
        if (elevation < 0.52) return Biomes.Beach; // 0.12 0.52

        if (elevation > 0.9) { // 0.8 77
            // if (moisture < 0.5) return Biomes.Scorched; // 0.1 0.5
            // if (moisture < 0.55) return Biomes.Bare; // 0.2 0.55
            // if (moisture < 0.6) return Biomes.Tundra; // 0.5 0.6
            // return Biomes.Snow;
            return Biomes.Snow;
        }

        if (elevation > 0.77) { // 0.8 77
            // if (moisture < 0.5) return Biomes.Scorched; // 0.1 0.5
            // if (moisture < 0.55) return Biomes.Bare; // 0.2 0.55
            // if (moisture < 0.6) return Biomes.Tundra; // 0.5 0.6
            // return Biomes.Snow;
            return Biomes.Scorched;
        }

        if (elevation > 0.7) { // 0.6 0.7
            // if (moisture < 0.625) return Biomes.TemperateDesert; // 0.33 0.625
            // if (moisture < 0.8) return Biomes.Shrubland; // 0.66 0.8
            // return Biomes.Taiga;
            return Biomes.Taiga;
        }

        if (elevation > 0.58) { // 0.3 0.58
            // if (moisture < 0.54) return Biomes.TemperateDesert; // 0.16 0.54
            // if (moisture < 0.675) return Biomes.GrassLand; // 0.50 0.675
            // if (moisture < 0.8) return Biomes.TemperateDeciduousForest; //0.83 0.8
            // return Biomes.TemperateRainForest;
            return Biomes.TemperateDeciduousForest;
        }

        if (moisture < 0.54) return Biomes.SubtropicalDesert;; // 0.16 0.54
        if (moisture < 0.625) return Biomes.GrassLand; // 0.33 0.625
        if (moisture < 0.675) return Biomes.TropicalSeasonalForest; // 0.66 0.675
        return Biomes.TropicalRainForest;
    }

    getElevation(x, y, base) {
        if (base) {
            var baseElevation = Math.floor(this.elevationData[x][y] * 10) - 5; //because seaa is lower than elevation 5 so we start at 1;
            if (baseElevation < 0) {
                baseElevation = 0;
            }
            return baseElevation;
        } else {
            return this.elevationData[x][y];
        }
    }
}