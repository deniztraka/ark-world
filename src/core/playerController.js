function getMouseAngle(a, p) {
    return Math.atan2(a.y - p.y, a.x - p.x) * 180 / Math.PI + 180; // 45
}

export class PlayerController {
    constructor(_phaserScene, _owner) {
        this.scene = _phaserScene;
        this.owner = _owner;

        this.activePointer = this.scene.input.activePointer;
        this.keys = {};
        this.keys.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keys.d = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keys.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keys.a = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keys.w = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keys.s = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }

    update(time, delta) {
        var self = this;
        this.updatePlayerMovement(time);

        // this.phaserScene.input.on('pointerdown', function(pointer) {
        //     if (pointer.rightButtonDown()) {
        //         self.owner.setDirection(self.getDirection());
        //         self.owner.states.isWalking = true;
        //     }
        // });

        // this.phaserScene.input.on('pointerup', function(pointer) {
        //     if (pointer.rightButtonDown() == 2) {
        //         self.owner.states.isWalking = false;
        //     }
        // });
    }

    updatePlayerMovement(time) {
        var self = this;

        var repeatMoveDelay = this.owner.speed;

        if (time > this.owner.lastMoveTime + repeatMoveDelay) {
            if (this.keys.s.isDown) {
                if (this.isTileOpenAt(this.owner.sprite.x, this.owner.sprite.y + this.scene.worldData.cellHeight)) {
                    this.scene.tweens.add({
                        targets: this.owner.sprite,
                        y: this.owner.sprite.y + this.scene.worldData.cellHeight / 2,
                        duration: repeatMoveDelay,
                        onComplete: function () {
                            self.owner.lastMoveTime = time;
                        },
                        delay: 0
                    });
                }
            } else if (this.keys.w.isDown) {
                if (this.isTileOpenAt(this.owner.sprite.x, this.owner.sprite.y - this.scene.worldData.cellHeight)) {
                    //this.owner.sprite.y -= this.scene.worldData.cellHeight;
                    this.scene.tweens.add({
                        targets: this.owner.sprite,
                        y: this.owner.sprite.y - this.scene.worldData.cellHeight / 2,
                        duration: repeatMoveDelay,
                        onComplete: function () {
                            self.owner.lastMoveTime = time;
                        },
                        delay: 0
                    });
                }
            }

            if (this.keys.a.isDown) {
                if (this.isTileOpenAt(this.owner.sprite.x - this.scene.worldData.cellWidth, this.owner.sprite.y)) {
                    //this.owner.sprite.x -= this.scene.worldData.cellWidth;
                    this.scene.tweens.add({
                        targets: this.owner.sprite,
                        x: this.owner.sprite.x - this.scene.worldData.cellWidth / 2,
                        duration: repeatMoveDelay,
                        onComplete: function () {
                            self.owner.lastMoveTime = time;
                        },
                        delay: 0
                    });
                }
            } else if (this.keys.d.isDown) {
                if (this.isTileOpenAt(this.owner.sprite.x + this.scene.worldData.cellWidth, this.owner.sprite.y)) {
                    //this.owner.sprite.x += this.scene.worldData.cellWidth;
                    this.scene.tweens.add({
                        targets: this.owner.sprite,
                        x: this.owner.sprite.x + this.scene.worldData.cellHeight / 2,
                        duration: repeatMoveDelay,
                        onComplete: function () {
                            self.owner.lastMoveTime = time;
                        },
                        delay: 0
                    });
                }
            }
        }
    }

    isTileOpenAt(worldX, worldY) {
        // nonNull = true, don't return null for empty tiles. This means null will be returned only for
        // tiles outside of the bounds of the map.
        var tile = this.scene.map.getTileAtWorldXY(worldX, worldY, true, this.owner.cam, this.scene.mapLayers["layer0"]);

        if (tile && !tile.collides) {
            return true;
        } else {
            return false;
        }
    }

    getDirection() {
        var worldPoint = this.activePointer.positionToCamera(this.phaserScene.cameras.main);
        var angle = getMouseAngle(this.owner.sprite, worldPoint);
        if (angle >= 22.5 && angle < 67.5) {
            return "E";
        } else if (angle >= 67.5 && angle < 112.5) {
            return "SE";
        } else if (angle >= 112.5 && angle < 157.5) {
            return "S";
        } else if (angle >= 22.5 && angle < 202.5) {
            return "SW";
        } else if (angle >= 22.5 && angle < 247.5) {
            return "W";
        } else if (angle >= 22.5 && angle < 292.5) {
            return "NW";
        } else if (angle >= 22.5 && angle < 337.5) {
            return "N";
        } else {
            return "NE";
        }
    }
}