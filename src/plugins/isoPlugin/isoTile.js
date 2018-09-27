import IsoHeight from '../../core/mixins/isoHeight';

export class IsoTile extends Phaser.Tilemaps.Tile {
    constructor(layer, index, x, y, width, height, baseWidth, baseHeight) {
        super(layer, index, x, y, width, height, baseWidth, baseHeight);
    }

    getCenterX(camera) {
        return this.getLeft(camera) + this.width / 2;
    }

    getTop(camera) {
        var tilemapLayer = this.tilemapLayer;

        // Tiled places tiles on a grid of baseWidth x baseHeight. The origin for a tile in grid
        // units is the bottom left, so the y coordinate needs to be adjusted by the difference
        // between the base size and this tile's size.
        return tilemapLayer ?
            tilemapLayer.tileToWorldY(this, camera) - (this.height - this.baseHeight) * tilemapLayer.scaleY :
            this.y * this.baseHeight - (this.height - this.baseHeight);
    }

    getLeft(camera) {
        var tilemapLayer = this.tilemapLayer;

        return (tilemapLayer) ? tilemapLayer.tileToWorldX(this, camera) : this.x * this.baseWidth;
    }

    getCenterY(camera) {
        return this.getTop(camera) + this.height / 2;
    }
}

Phaser.Class.mixin(IsoTile, [
    IsoHeight
]);