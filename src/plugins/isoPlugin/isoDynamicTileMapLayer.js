import * as IsoTileMapComponents from './isoTileMapComponents';

export class IsoDynamicTileMapLayer extends Phaser.Tilemaps.DynamicTilemapLayer {
    constructor(scene, tilemap, layerIndex, tileset, x, y) {
        super(scene, tilemap, layerIndex, tileset, x, y);

        //change tilePositions to render it isometric style
        for (let x = 0; x < this.layer.data.length; x++) {
            for (let y = 0; y < this.layer.data[x].length; y++) {
                this.layer.data[x][y].pixelX = (this.layer.data[x][y].x - this.layer.data[x][y].y) * 32;
                this.layer.data[x][y].pixelY = (this.layer.data[x][y].x + this.layer.data[x][y].y) * 16;
            }
        }
    }
}