function getMouseAngle(a, p) {
    return Math.atan2(a.y - p.y, a.x - p.x) * 180 / Math.PI + 180; // 45
}

import {
    PlayerController
} from '../../core/playerController';


export class Player {
    constructor(scene, x, y) {
        this.currentMapPosition = new Phaser.Math.Vector2(x, y);
        this.phaserScene = scene;
        this.sprite = scene.add.sprite(x * 32 + 16, y * 32 + 16, 'hero', 5);
        this.sprite.setOrigin(0.5, 1);

        this.map = scene.map;
        this.cam = scene.cameras.main;
        this.controller = new PlayerController(scene, this);
        this.speed = 100;

        this.cursors = scene.input.keyboard.createCursorKeys();

        this.direction = "N";
        var self = this;


        scene.eventEmitter.on("gameSceneUpdate!", function(time, delta) {
            self.update(time, delta);
        });

        this.lastMoveTime = 0;

        this.cam.setBounds(0, 0, 100 * 16, 100 * 16);
        this.cam.scrollX = this.sprite.x - this.sprite.width * 0.5;
        this.cam.scrollY = this.sprite.y - this.sprite.height * 0.5;
    }

    update(time, delta) {
        this.controller.update(time, delta);
        //this.updatePlayerMovement(time);
        // Smooth follow the player
        var smoothFactor = 0.9;

        this.cam.scrollX = smoothFactor * this.cam.scrollX + (1 - smoothFactor) * (this.sprite.x - this.cam.width * 0.5);
        this.cam.scrollY = smoothFactor * this.cam.scrollY + (1 - smoothFactor) * (this.sprite.y - this.cam.height * 0.5);
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
}