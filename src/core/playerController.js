function getMouseAngle(a, p) {
    return Math.atan2(a.y - p.y, a.x - p.x) * 180 / Math.PI + 180; // 45
}

function getDirection() {

}

export class PlayerController {
    constructor(_phaserScene, _owner) {
        this.phaserScene = _phaserScene;
        this.owner = _owner;

        this.activePointer = this.phaserScene.input.activePointer;
        this.keys = {};
        this.keys.right = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.keys.d = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keys.left = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keys.a = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.up = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keys.w = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.down = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.keys.s = this.phaserScene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }

    update() {
        this.owner.setDirection(this.getDirection());
        // if (this.activePointer.rightButtonDown()) {
        //     this.owner.states.isWalking = true;
        // } else {
        //     this.owner.states.isWalking = false;
        // }

        //console.log(this.owner.states.isWalking);
    }

    getDirection() {
        var worldPoint = this.activePointer.positionToCamera(this.phaserScene.cameras.main);
        var angle = getMouseAngle(this.owner, worldPoint);
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