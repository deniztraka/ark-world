import * as IsoTileMapComponents from './isoTileMapComponents';

import {
    TileMarker
} from '../../core/tilemap/tileMarker';
export class IsoDynamicTileMapLayer extends Phaser.Tilemaps.DynamicTilemapLayer {
    constructor(scene, tilemap, layerIndex, tileset, x, y) {
        super(scene, tilemap, layerIndex, tileset, x, y);
        this.skipCull = true;
        this.tileMarker = null;


        //change tilePositions to render it isometric style
        for (let x = 0; x < this.layer.data.length; x++) {
            for (let y = 0; y < this.layer.data[x].length; y++) {
                this.layer.data[x][y].pixelX = (this.layer.data[x][y].x - this.layer.data[x][y].y) * 32;
                this.layer.data[x][y].pixelY = (this.layer.data[x][y].x + this.layer.data[x][y].y) * 16;
            }
        }

        //to see the whole map
        //this.x = this.layer.data[x].length * 32;
    }

    enableMarker(scene) {
        var self = this;
        this.tileMarker = new TileMarker(scene);

        scene.game.input.addMoveCallback(function(pointer) {
            self.updateMarker(pointer, self.tileMarker, self);
        });
    }

    updateMarker(pointer, tileMarker, self) {
        var camera = tileMarker.scene.cameras.main;
        tileMarker.x = pointer.x + camera.scrollX; //* (1 - tileMarker.scrollFactorX);
        tileMarker.y = pointer.y + camera.scrollY; //* (1 - tileMarker.scrollFactorY); 

        console.log(this.worldToTileXY(pointer.x, pointer.y, false));
        var tileIndexPointer = this.worldToTileXY(pointer.x, pointer.y, false);
        tileMarker.x = ((tileIndexPointer.x - tileIndexPointer.y) * (64 / 2)) + 32;
        tileMarker.y = ((tileIndexPointer.x + tileIndexPointer.y) * (32 / 2));

    }

    tileToWorldX(tile, camera) {
        return IsoTileMapComponents.tileToWorldX(tile, camera, this.layer);
    }


    tileToWorldY(tile, camera) {
        return IsoTileMapComponents.tileToWorldY(tile, camera, this.layer);
    }

    tileToWorldXY(tile, point, camera) {
        return IsoTileMapComponents.tileToWorldXY(tile, point, camera, this.layer);
    }

    worldToTileX(worldX, worldY, snapToFloor, camera) {
        return IsoTileMapComponents.worldToTileX(worldX, worldY, snapToFloor, camera, this.layer);
    }


    worldToTileY(worldX, worldY, snapToFloor, camera) {
        return IsoTileMapComponents.worldToTileY(worldX, worldY, snapToFloor, camera, this.layer);
    }


    worldToTileXY(worldX, worldY, snapToFloor, point, camera) {
        return IsoTileMapComponents.worldToTileXY(worldX, worldY, snapToFloor, point, camera, this.layer);
    }

    //TODO: Fix culling for isometric map.
    //return tiles array to be rendered within camera
    // cull(camera) {
    //     debugger;
    //     this.culledTiles = [];
    //     for (let x = 0; x < this.layer.data.length; x++) {
    //         const row = this.layer.data[x];
    //         for (let y = 0; y < row.length; y++) {
    //             const tile = row[y];

    //             if (tile.pixelX < camera.worldView.width && tile.pixelY < camera.worldView.height) {
    //                 this.culledTiles.push(tile);
    //             }

    //         }

    //     }

    //     console.log(this.culledTiles.length);

    // }

}