import {
    PlayerController
} from '../../core/playerController';

export class Ogre extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "ogre");
        this.direction = "N";
        var self = this;
        this.setOrigin(0.5, 0.75);

        //anims loading
        getAnims().forEach(anim => {
            scene.anims.create(anim);
            self.anims.load(anim.key);
        });

        //controls
        this.controls = getControls(scene);


        this.inputHandler = new PlayerController(this.scene, this);
        this.states = {
            isWalking: false,
            isRunning: false
        };


        //this.anims.play('walkNW');
        scene.add.existing(this);

        scene.eventEmitter.on("gameSceneUpdate!", function() {
            self.update();
        });

    }

    update() {
        this.inputHandler.update();
        this.handleAnimations();
    }

    handleAnimations() {
        if (this.states.isWalking) {
            this.playAnimation("walk" + this.direction);
        } else {
            this.playAnimation("idle" + this.direction);
        }
    }

    playAnimation(animationKey) {
        if (this.anims.currentAnim.key == animationKey) {
            this.anims.play(animationKey, true);
        } else {
            this.anims.play(animationKey);
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