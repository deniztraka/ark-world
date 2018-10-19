import {
    PlayerController
} from '../../core/playerController';

function getMouseAngle(a, p) {
    return Math.atan2(a.y - p.y, a.x - p.x) * 180 / Math.PI + 180; // 45
}

export class Player {
    constructor(scene, x, y, group) {
        this.currentMapPosition = new Phaser.Math.Vector2(x, y);
        this.phaserScene = scene;
        this.sprite = scene.add.isoSprite(x * 32, y * 32, 100, 'ogre', group);

        this.direction = "N";
        var self = this;
        this.sprite.setOrigin(0.5, 0.5, 0.1);

        getAnims().forEach(anim => {
            scene.anims.create(anim);
            self.sprite.anims.load(anim.key);
        });



        //controls
        this.controls = getControls(scene);

        this.states = {
            isWalking: false,
            isRunning: false
        };

        scene.eventEmitter.on("gameSceneUpdate!", function(time, delta) {
            self.update(time, delta);
        });

        this.lastMoveTime = 0;


        scene.isoPhysics.world.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;

    }

    update(time, delta) {

        this.handleMovement(time, delta);
        this.handleAnimation(time, delta);
    }

    getDirection() {
        var worldPoint = this.phaserScene.input.activePointer.positionToCamera(this.phaserScene.cameras.main);
        var angle = getMouseAngle(this.sprite, worldPoint);
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

    handleAnimation(time, delta) {
        if (this.states.isWalking) {
            this.playAnimation("walk" + this.direction);
        } else {
            this.playAnimation("idle" + this.direction);
        }
    }

    playAnimation(animationKey) {

        this.sprite.anims.play(animationKey, this.sprite.anims.currentAnim.key == animationKey, 0);

    }

    handleMovement(time, delta) {
        var self = this;
        var speed = 100;
        this.phaserScene.input.on('pointerdown', function(pointer) {
            if (pointer.rightButtonDown()) {
                self.states.isWalking = true;
                self.direction = self.getDirection();
                switch (self.direction) {
                    case "NW":
                        self.sprite.body.velocity.y = -speed;
                        self.sprite.body.velocity.x = -speed;
                        break;
                    case "N":
                        self.sprite.body.velocity.y = -speed;
                        break;
                    case "NE":
                        self.sprite.body.velocity.y = -speed;
                        self.sprite.body.velocity.x = speed;
                        break;
                    case "E":
                        self.sprite.body.velocity.x = speed;
                        break;
                    case "SE":
                        self.sprite.body.velocity.y = speed;
                        self.sprite.body.velocity.x = speed;
                        break;
                    case "S":
                        self.sprite.body.velocity.y = speed;
                        break;
                    case "SW":
                        self.sprite.body.velocity.y = speed;
                        self.sprite.body.velocity.x = -speed;
                        break;
                    case "W":
                        self.sprite.body.velocity.x = -speed;
                        break;
                }
            }
        });

        this.phaserScene.input.on('pointerup', function(pointer) {
            if (pointer.rightButtonDown() == 2) {
                self.sprite.body.velocity.x = 0;
                self.sprite.body.velocity.y = 0;
                self.states.isWalking = false;
            }
        });


        if (Phaser.Input.Keyboard.JustDown(this.controls.spaceBar)) {
            var tempz = this.sprite.body.z;
            this.sprite.body.z = tempz + 5;
            this.sprite.body.velocity.z = 200;
            this.playAnimation("walk" + this.direction);

        }

        // if (this.controls.w.isDown) {
        //     this.sprite.body.velocity.y = -speed;
        // } else if (this.controls.s.isDown) {
        //     this.sprite.body.velocity.y = speed;
        // } else {
        //     this.sprite.body.velocity.y = 0;
        // }

        // if (this.controls.a.isDown) {
        //     this.sprite.body.velocity.x = -speed;
        // } else if (this.controls.d.isDown) {
        //     this.sprite.body.velocity.x = speed;
        // } else {
        //     this.sprite.body.velocity.x = 0;
        // }
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