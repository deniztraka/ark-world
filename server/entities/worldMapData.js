const {
    libnoise
} = require('libnoise');

const Biomes = require('../data/biome');

const PoissonDiskSampling = require('poisson-disk-sampling');

class WorldMapData {

    constructor(seed, width, height, cellWidth, cellHeight) {
        this.seed = seed;
        this.width = width;
        this.height = height;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;

        this.defaultWorldNoiseMinVal = 0;
        this.defaultWorldNoiseMaxVal = 0;
        this.normalizedWorldNoiseMinVal = 0;
        this.normalizedWorldNoiseMaxVal = 0;
        this.defaultWorldMoistureMinVal = 0;
        this.defaultWorldMoistureMaxVal = 0;
        this.normalizedWorldMoistureMinVal = 0;
        this.normalizedWorldMoistureMaxVal = 0;

        this.elevationData = [...Array(this.width)].map(x => Array(this.height).fill(0));
        this.baseElevationData = [...Array(this.width)].map(x => Array(this.height).fill(0));
        this.moistureData = [...Array(this.width)].map(x => Array(this.height).fill(0));
        this.biomeData = [...Array(this.width)].map(x => Array(this.height).fill(0));
        this.treePositions = [];

        this.isMoistureDataFilled = false;
        this.isElevationDataFilled = false;
        this.isTreePositionsFilled = false;
    }

    generate(seed) {
        if (seed) {
            this.seed = seed;
        }
        this.generateWith(0.001, 2, 0.5, 6, libnoise.QualityMode.HIGH, this.seed);
        this.generateBiomeData();
        //this.generateRivers();
        this.generateTreePositions();
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

        this.isElevationDataFilled = true;


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


        this.isMoistureDataFilled = true;
    }

    getRandomPoint(biomeName) {
        var rX = Math.floor(Math.random() * this.width);
        var rY = Math.floor(Math.random() * this.height);

        if (this.biomeData[rX][rY].name == biomeName) {

            return {
                x: rX,
                y: rY
            };
        } else {
            //console.log("tried " + rX + " " + rY + " " + this.biomeData[rX][rY].name);
            return this.getRandomPoint(biomeName);
        }
    }

    generateLake(point) {
        console.log("makingg lake at this point:" + point.x + "," + point.y);

        this.floodFill(point.x, point.y, this.elevationData[point.x][point.y]);
    }

    floodFill(x, y, elevationData) {



        /* Set current color to fillColor, then perform following operations. */

        if (this.elevationData[x] && this.elevationData[x][y] <= elevationData) {

            console.log("filled:" + x + "," + y + " eld:" + this.elevationData[x][y]);
            console.log();

            this.biomeData[x][y] = Biomes.Snow; // Set pixel color to fillColor
            if (this.elevationData[x + 1] && this.elevationData[x - 1]) {
                this.floodFill(x + 1, y, this.elevationData[x + 1][y]);

                this.floodFill(x - 1, y, this.elevationData[x - 1][y]);

                this.floodFill(x, y + 1, this.elevationData[x][y + 1]);

                this.floodFill(x, y - 1, this.elevationData[x][y - 1]);
            }
        }
    }

    generateRivers() {
        var self = this;
        var rivers = [];

        var riverCount = Math.floor(Math.random() * 5);

        for (let i = 0; i < riverCount; i++) {

            var river = {
                startPoint: null,
                points: [],
                endPoint: null
            };
            var riverStartPoint = this.getRandomPoint("Scorched");
            var rX = riverStartPoint.x;
            var rY = riverStartPoint.y;

            river.startPoint = riverStartPoint;

            var currentBiome = this.biomeData[rX][rY];


            var currentBiomeName = currentBiome.name;
            var currentElevation = 1;


            var counter = 0;
            while (currentBiomeName != "Sea") {
                var adjacentTiles = [];

                // console.log("");
                // console.log("------------------------------------------------------");
                // console.log("current:" + rX + "," + rY + " biome:" + currentBiomeName + " elv:" + currentElevation);
                // console.log(">");
                // console.log("leftEl:" + this.elevationData[rX - 1][rY]);
                // console.log("right:" + this.elevationData[rX + 1][rY]);
                // console.log("top:" + this.elevationData[rX][rY - 1]);
                // console.log("bottom:" + this.elevationData[rX][rY + 1]);



                //left tile elevation            
                if (this.elevationData[rX - 1] && currentElevation > this.elevationData[rX - 1][rY]) {
                    adjacentTiles.push({
                        x: rX - 1,
                        y: rY
                    });
                }

                //right tile elevation            
                if (this.elevationData[rX + 1] && currentElevation > this.elevationData[rX + 1][rY]) {
                    adjacentTiles.push({
                        x: rX + 1,
                        y: rY
                    });
                }

                //top tile elevation            
                if (this.elevationData[rY - 1] && currentElevation > this.elevationData[rX][rY - 1]) {
                    adjacentTiles.push({
                        x: rX,
                        y: rY - 1
                    });
                }

                //bottom tile elevation            
                if (this.elevationData[rY + 1] && currentElevation > this.elevationData[rX][rY + 1]) {
                    adjacentTiles.push({
                        x: rX,
                        y: rY + 1
                    });
                }

                //console.log(adjacentTiles.length);
                if (adjacentTiles.length == 0) {
                    // console.log("dont have next");                    
                    //Todo: make it lake
                    // self.generateLake({
                    //     x: rX,
                    //     y: rY
                    // });
                    // console.log("------------------------------------------------------");
                    break;
                }

                var lowest = Number.POSITIVE_INFINITY;
                var nextPoint = null;
                for (var t = adjacentTiles.length - 1; t >= 0; t--) {
                    var tmp = this.getElevation(adjacentTiles[t].x, adjacentTiles[t].y, false);
                    if (tmp < lowest) {
                        lowest = tmp;
                        nextPoint = adjacentTiles[t];
                    }
                }
                // console.log(nextPoint);
                // console.log(tmp);


                currentBiome = this.biomeData[nextPoint.x][nextPoint.y];
                currentBiomeName = currentBiome.name;
                currentElevation = this.getElevation(nextPoint.x, nextPoint.y, false);
                rX = nextPoint.x;
                rY = nextPoint.y;
                // console.log("next:" + rX + "," + rY + " biome:" + currentBiomeName + " elv:" + currentElevation);
                // console.log("------------------------------------------------------");

                river.points.push(nextPoint);
                if (currentBiomeName == "Sea" || currentBiomeName == "River") {
                    river.points.endPoint = nextPoint;
                }
                counter++;
            }

            rivers.push(river);


        }

        rivers.forEach(river => {

            self.biomeData[river.startPoint.x][river.startPoint.y] = Biomes.River;
            //self.biomeData[river.endPoint.x][river.endPoint.y] = Biomes.River;

            river.points.forEach(point => {
                self.biomeData[point.x][point.y] = Biomes.River;
            });
        });

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

        this.isTreePositionsFilled = true;
    }

    generateBiomeData() {
        if (this.isElevationDataFilled && this.isMoistureDataFilled) {
            for (var x = 0; x < this.width; x++) {
                for (var y = 0; y < this.height; y++) {
                    var currentBiome = this.getBiome(this.elevationData[x][y], this.moistureData[x][y]);
                    this.biomeData[x][y] = currentBiome;
                }
            }
        } else {
            console.log("Could nott generate BiomeData: Elevation and Moisture data must be filled.");
        }
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
};

module.exports = WorldMapData;