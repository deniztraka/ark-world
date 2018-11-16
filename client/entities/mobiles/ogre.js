import {
    PlayerController
} from '../../core/playerController';

export class Ogre {
    constructor(scene, x, y) {
        this.currentMapPosition = new Phaser.Math.Vector2(x, y);

        this.sprite = scene.add.isoSprite(x * 32, y * 32, 32, 'ogre');

        this.direction = "N";
        var self = this;
        this.sprite.setOrigin(0.5, 0.75);

        //anims loading
        getAnims().forEach(anim => {
            scene.anims.create(anim);
            self.sprite.anims.load(anim.key);
        });

        //controls
        this.controls = getControls(scene);


        this.inputHandler = new PlayerController(scene, this);
        this.states = {
            isWalking: false,
            isRunning: false
        };

        debugger;
        scene.eventEmitter.on("gameSceneUpdate!", function(time, delta) {
            self.update(time, delta);
        });

        this.lastMoveTime = 0;

    }

    update(time, delta) {

        this.inputHandler.update();
        this.handleAnimations();
        this.handleMovement(time, delta);
    }

    handleMovement(time, delta) {
        var repeatMoveDelay = 250;

        if (time > this.lastMoveTime + repeatMoveDelay) {
            if (this.states.isWalking) {

                this.moveToCurrentDirection(1, time, delta);
                this.lastMoveTime = time;
            }
        }
    }

    moveToCurrentDirection(numberOfTiles, time, delta) {

        function setPosition(nextPosition, context, pTime, pDelta) {
            if (nextPosition) {
                var nextTile = null;

                if (context.scene) {
                    nextTile = context.scene.map.getTileAt(nextPosition.x, nextPosition.y, true, context.scene.mapLayers.layer0);
                } else {
                    var filtered = context.sprite.scene.tileStackData[0].filter(function(tilep) {
                        return tilep.tileData.x == nextPosition.x && tilep.tileData.y == nextPosition.y;
                    });
                    if (filtered.length > 0) {
                        nextTile = filtered[0];
                    }
                }

                if (nextTile != null && !nextTile.hasElevationStack) {

                    context.sprite.x = nextTile.x;
                    context.sprite.y = nextTile.y;
                    context.currentMapPosition = new Phaser.Math.Vector2(nextTile.tileData.x, nextTile.tileData.y);
                } else {
                    context.states.isWalking = false;
                }
            }
        }


        var nextMapPosition = this.getNextMapPoisiton(numberOfTiles);
        setPosition(nextMapPosition, this, time, delta);
    }

    getNextMapPoisiton(numberOfTiles) {
        switch (this.direction) {
            case "NW":
                return new Phaser.Math.Vector2(this.currentMapPosition.x - numberOfTiles, this.currentMapPosition.y - numberOfTiles);
                break;
            case "N":
                return new Phaser.Math.Vector2(this.currentMapPosition.x, this.currentMapPosition.y - numberOfTiles);
                break;
            case "NE":
                return new Phaser.Math.Vector2(this.currentMapPosition.x + numberOfTiles, this.currentMapPosition.y - numberOfTiles);
                break;
            case "E":
                return new Phaser.Math.Vector2(this.currentMapPosition.x + numberOfTiles, this.currentMapPosition.y);
                break;
            case "SE":
                return new Phaser.Math.Vector2(this.currentMapPosition.x + numberOfTiles, this.currentMapPosition.y + numberOfTiles);
                break;
            case "S":
                return new Phaser.Math.Vector2(this.currentMapPosition.x, this.currentMapPosition.y + numberOfTiles);
                break;
            case "SW":
                return new Phaser.Math.Vector2(this.currentMapPosition.x - numberOfTiles, this.currentMapPosition.y + numberOfTiles);
                break;
            case "W":
                return new Phaser.Math.Vector2(this.currentMapPosition.x - numberOfTiles, this.currentMapPosition.y);
                break;
        }
    }

    handleAnimations() {
        if (this.states.isWalking) {
            this.playAnimation("walk" + this.direction);
        } else {
            this.playAnimation("idle" + this.direction);
        }
    }

    playAnimation(animationKey) {
        if (this.sprite.anims.currentAnim.key == animationKey) {
            this.sprite.anims.play(animationKey, true);
        } else {
            this.sprite.anims.play(animationKey);
        }
    }

    setDirection(direction) {
        this.direction = direction;
    }

}

function getControls(scene) {
    return {
        spaceBar: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
        w: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        a: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        s: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        d: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    }
}

function getAnims() {
    return [
        //walking starts here
        {
            key: 'walkSW',
            frames: [{
                    key: "ogre",
                    frame: 0
                },
                {
                    key: "ogre",
                    frame: 1
                },
                {
                    key: "ogre",
                    frame: 2
                },
                {
                    key: "ogre",
                    frame: 3
                }
            ],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'walkW',
            frames: [{
                    key: "ogre",
                    frame: 8
                },
                {
                    key: "ogre",
                    frame: 9
                },
                {
                    key: "ogre",
                    frame: 10
                },
                {
                    key: "ogre",
                    frame: 11
                }
            ],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'walkNW',
            frames: [{
                    key: "ogre",
                    frame: 16
                },
                {
                    key: "ogre",
                    frame: 17
                },
                {
                    key: "ogre",
                    frame: 18
                },
                {
                    key: "ogre",
                    frame: 19
                }
            ],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'walkN',
            frames: [{
                    key: "ogre",
                    frame: 24
                },
                {
                    key: "ogre",
                    frame: 25
                },
                {
                    key: "ogre",
                    frame: 26
                },
                {
                    key: "ogre",
                    frame: 27
                }
            ],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'walkNE',
            frames: [{
                    key: "ogre",
                    frame: 32
                },
                {
                    key: "ogre",
                    frame: 33
                },
                {
                    key: "ogre",
                    frame: 34
                },
                {
                    key: "ogre",
                    frame: 35
                }
            ],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'walkE',
            frames: [{
                    key: "ogre",
                    frame: 40
                },
                {
                    key: "ogre",
                    frame: 41
                },
                {
                    key: "ogre",
                    frame: 42
                },
                {
                    key: "ogre",
                    frame: 43
                }
            ],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'walkSE',
            frames: [{
                    key: "ogre",
                    frame: 48
                },
                {
                    key: "ogre",
                    frame: 49
                },
                {
                    key: "ogre",
                    frame: 50
                },
                {
                    key: "ogre",
                    frame: 51
                }
            ],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'walkS',
            frames: [{
                    key: "ogre",
                    frame: 56
                },
                {
                    key: "ogre",
                    frame: 57
                },
                {
                    key: "ogre",
                    frame: 58
                },
                {
                    key: "ogre",
                    frame: 59
                }
            ],
            frameRate: 6,
            repeat: -1
        },


        //Idle starts here

        {
            key: 'idleSW',
            frames: [{
                key: "ogre",
                frame: 0
            }],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'idleW',
            frames: [{
                key: "ogre",
                frame: 8
            }],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'idleNW',
            frames: [{
                key: "ogre",
                frame: 16
            }],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'idleN',
            frames: [{
                key: "ogre",
                frame: 24
            }],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'idleNE',
            frames: [{
                key: "ogre",
                frame: 32
            }],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'idleE',
            frames: [{
                key: "ogre",
                frame: 40
            }],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'idleSE',
            frames: [{
                key: "ogre",
                frame: 48
            }],
            frameRate: 6,
            repeat: -1
        },
        {
            key: 'idleS',
            frames: [{
                key: "ogre",
                frame: 56
            }],
            frameRate: 6,
            repeat: -1
        }
    ]
}