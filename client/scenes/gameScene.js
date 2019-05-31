import {
    Player
} from '../entities/mobiles/basicPlayer';

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

        //this.renderSize = 10;

        this.shadows = [];
        this.staticMapData = null;
    }

    init(obj) {

        var self = this;
        this.staticMapData = obj.staticMapData;
        this.socket = obj.socket;
        console.log(this.staticMapData);

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
            console.log(tile.x + "," + tile.y);


        }, this);


        var titleText = this.add.text(this.scene.manager.game.renderer.width / 2, this.scene.manager.game.renderer.height / 2 - 15, '', {
            fontWeight: "bold",
            font: '30px Courier',
            fill: '#ffffff'
        });
        titleText.setOrigin(0.5, 0.5);
        titleText.setText("Fight!");

        // for (let x = 0; x < 50; x++) {
        //     for (let y = 0; y < 50; y++) {
        //         var titleText = this.add.text(x * 32 + 16, y * 32 + 16, '', {
        //             fontWeight: "bold",
        //             font: '10px Courier',
        //             fill: '#ffffff'
        //         });
        //         titleText.setOrigin(0.5, 0.5);
        //         titleText.setText("|" + x + "," + y + "|");
        //     }
        // }


        // for (let x = 0; x < 50; x++) {
        //     for (let y = 0; y < 50; y++) {
        //         var titleText = this.add.text(x * 32 + 16, y * 32 + 16, '', {
        //             fontWeight: "bold",
        //             font: '10px Courier',
        //             fill: '#ffffff'
        //         });
        //         titleText.setOrigin(0.5, 0.5);
        //         titleText.setText(this.map.getTileAt(x, y).index);
        //     }
        // }
    }

    update(time, delta) {
        var self = this;

        if (this.controls) {
            this.controls.update(delta);
        }
        this.eventEmitter.emit("gameSceneUpdate!", time, delta);
    }

    createPlayer() {
        // console.log(this.socket.id);
        // console.log(this.staticMapData.startingPoints[this.socket.id]);
        this.player = new Player(this, this.staticMapData.startingPoints[this.socket.id].x, this.staticMapData.startingPoints[this.socket.id].y);
    }

    createWorld() {
        var self = this;

        this.map = this.make.tilemap({
            tileWidth: self.staticMapData.environment.tileWidth,
            tileHeight: self.staticMapData.environment.tileHeight,
            width: self.staticMapData.width,
            height: self.staticMapData.height
        });
        var tiles = this.map.addTilesetImage('rogueLike_tiles_extended');
        this.mapLayers = {
            layer0: self.map.createBlankDynamicLayer('layer0', tiles),
        };

        //var tile = this.map.putTileAt(56,0, 0, true, this.mapLayers["layer0"]);

        var staticLayer = this.mapLayers["layer0"]
        for (var x = 0; x < self.staticMapData.width; x++) {
            for (var y = 0; y < self.staticMapData.height; y++) {
                //debugger;
                if (self.staticMapData.tiles[x][y] == this.staticMapData.indexes.wall) {
                    this.map.putTileAt(self.getWallIndex(x, y), x, y, true, staticLayer);
                } else if (self.staticMapData.tiles[x][y] == this.staticMapData.indexes.floor) {
                    this.map.putTileAt(self.getFloorIndex(x, y), x, y, true, staticLayer);
                } else if (self.staticMapData.tiles[x][y] == this.staticMapData.indexes.door) {
                    this.map.putTileAt(self.getFloorIndex(x, y), x, y, true, staticLayer);
                } else {
                    this.map.putTileAt(self.getEmptyIndex(x, y), x, y, true, staticLayer);
                }
            }
        }

        this.mapLayers["layer0"].setCollision(self.staticMapData.collisionIndexes);
    }

    getFloorIndex(x, y) {
        return this.staticMapData.environment.indices.floors.outer.sort(function() {
            return .5 - Math.random()
        })[0];
    }

    getDoorIndex(x, y) {
        const neighbours = {
            n: this.staticMapData.tiles[x][y - 1],
            s: this.staticMapData.tiles[x][y + 1],
            w: this.staticMapData.tiles[x - 1][y],
            e: this.staticMapData.tiles[x + 1][y],
            nw: this.staticMapData.tiles[x - 1][y - 1],
            ne: this.staticMapData.tiles[x + 1][y - 1],
            sw: this.staticMapData.tiles[x - 1][y + 1],
            se: this.staticMapData.tiles[x + 1][y + 1]
        };

        const n = neighbours.n && neighbours.n === this.staticMapData.indexes.wall;
        const s = neighbours.s && neighbours.s === this.staticMapData.indexes.wall;
        const w = neighbours.w && neighbours.w === this.staticMapData.indexes.wall;
        const e = neighbours.e && neighbours.e === this.staticMapData.indexes.wall;

        const i = this.staticMapData.environment.indices.doors;

        if (n && e) {
            return i.ne;
        }
        if (s && e) {
            return i.s_e;
        }
    }

    getEmptyIndex(x, y) {
        return this.staticMapData.indexes.empty;
    }

    getWallIndex(x, y) {
        const neighbours = {
            n: this.staticMapData.tiles[x][y - 1],
            s: this.staticMapData.tiles[x][y + 1],
            w: this.staticMapData.tiles[x - 1][y],
            e: this.staticMapData.tiles[x + 1][y],
            nw: this.staticMapData.tiles[x - 1][y - 1],
            ne: this.staticMapData.tiles[x + 1][y - 1],
            sw: this.staticMapData.tiles[x - 1][y + 1],
            se: this.staticMapData.tiles[x + 1][y + 1]
        };

        const n = neighbours.n && neighbours.n === this.staticMapData.indexes.wall;
        const s = neighbours.s && neighbours.s === this.staticMapData.indexes.wall;
        const w = neighbours.w && neighbours.w === this.staticMapData.indexes.wall;
        const e = neighbours.e && neighbours.e === this.staticMapData.indexes.wall;

        const i = this.staticMapData.environment.indices.walls;

        if (n && e && s && w) {
            return i.intersections.n_e_s_w;
        }
        if (n && e && s) {
            return i.intersections.n_e_s;
        }
        if (n && s && w) {
            return i.intersections.n_s_w;
        }
        if (e && s && w) {
            return i.intersections.e_s_w;
        }
        if (n && e && w) {
            return i.intersections.n_e_w;
        }

        if (e && s) {
            return i.intersections.e_s;
        }
        if (e && w) {
            return i.intersections.e_w;
        }
        if (s && w) {
            return i.intersections.s_w;
        }
        if (n && s) {
            return i.intersections.n_s;
        }
        if (n && e) {
            return i.intersections.n_e;
        }
        if (n && w) {
            return i.intersections.n_w;
        }

        if (n) {
            return i.intersections.n;
        }
        if (s) {
            return i.intersections.s;
        }
        if (e) {
            return i.intersections.e;
        }
        if (w) {
            return i.intersections.w;
        }

        return i.alone;
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