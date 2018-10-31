export function createIsoTile(phaserScene, x, y, z, texture, group, elevation) {

    var tile = phaserScene.add.isoSprite(x * phaserScene.projectionX, y * phaserScene.projectionY, z, texture, group);
    phaserScene.isoPhysics.world.enable(tile);

    tile.tileData = {};
    tile.tileData.x = x;
    tile.tileData.y = y;
    tile.elevation = 0;
    tile.elevation = elevation;
    tile.hasElevationStack = elevation > 0;
    tile.body.allowGravity = false;

    tile.setInteractive();
    tile.body.blocked = {
        up: true,
        down: true,
        frontX: true,
        frontY: true,
        backX: true,
        backY: true
    };
    tile.body.immovable = true;

    // tile.on('pointerover', function() {
    //     this.setTint(0x86bfda);
    //     //this.isoZ += 5;

    // });

    // tile.on('pointerdown', function() {
    //     this.destroy();
    // });

    // tile.on('pointerout', function() {
    //     this.clearTint();
    //     //this.isoZ -= 5;
    // });
    //tile.setOrigin(0.5, 0.5);

    if (elevation == 0) {
        tile.tint = 0xffffff;
    } else if (elevation == 1) {
        tile.tint = 0xdddddd;
    } else if (elevation == 2) {
        tile.tint = 0xbbbbbb;
    } else if (elevation == 3) {
        tile.tint = 0x999999;
    } else if (elevation == 4) {
        tile.tint = 0x666666;
    } else if (elevation == 5) {
        tile.tint = 0x333333;
    }

    if (!phaserScene.tileStackData[elevation]) {
        phaserScene.tileStackData[elevation] = [];
    }

    phaserScene.tileStackData[elevation].push(tile);
    return tile;

}