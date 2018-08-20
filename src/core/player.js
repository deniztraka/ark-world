export class Player {
    constructor(phaserScene, x, y) {
        this.phaserScene = phaserScene;
        this.bodyContainer = phaserScene.add.container(x, y);

        let body = phaserScene.add.sprite(0, 0, "humanBody").setOrigin(0.5, 0.5).setScale(0.75, 1);
        body.tint = Math.random() * 0xffffff;
        body.tintFill = true;
        let head = phaserScene.add.sprite(0, -22, "humanHead").setOrigin(0.5, 0.5);
        let eyes = phaserScene.add.sprite(0, -20, "humanEyes").setOrigin(0.5, 0.5);
        let legs = phaserScene.add.sprite(0, 15, "humanLegs").setOrigin(0.5, 0.5);
        legs.tint = Math.random() * 0xffffff;
        legs.tintFill = true;
        this.bodyContainer.add([legs, body, head, eyes]);
    }
}