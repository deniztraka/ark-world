import * as IsoTileMapComponents from './isoTileMapComponents';

import {
    TileMarker
} from '../../core/tilemap/tileMarker';

import DynamicTileMapRender from './dynamicIsoTileMapRender';
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
        debugger;
        this.tileMarker = new TileMarker(scene);

        scene.game.input.addMoveCallback(function(pointer) {
            self.updateMarker(self.tileMarker, self);
        });
    }

    updateMarker(tileMarker, self) {
        var worldPoint = self.scene.input.activePointer.positionToCamera(self.scene.cameras.main);
        var tileIndexPointer = this.worldToTileXY(worldPoint.x, worldPoint.y, false);
        if (tileIndexPointer) {
            var tile = this.layer.data[tileIndexPointer.x][tileIndexPointer.y];
            tileMarker.x = tile.pixelX;
            tileMarker.y = tile.pixelY;
        }
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

        var worldPoint = this.scene.input.activePointer.positionToCamera(this.scene.cameras.main);

        var tileIndexPointer = IsoTileMapComponents.worldToTileXY(worldPoint.x, worldPoint.y, snapToFloor, point, this.scene.cameras.main, this.layer);

        if (tileIndexPointer.x < 0 || tileIndexPointer.y < 0 || tileIndexPointer.x >= this.layer.data.length || tileIndexPointer.y >= this.layer.data[0].length) {
            return;
        }

        var closestTile = this.layer.data[tileIndexPointer.x][tileIndexPointer.y];

        var minimumDistance = Phaser.Math.Distance.Between(closestTile.x, closestTile.y, worldPoint.x, worldPoint.y);

        //currentTile
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (tileIndexPointer.x + i < 0 || tileIndexPointer.y + j < 0 || tileIndexPointer.x + i >= this.layer.data.length || tileIndexPointer.y + j >= this.layer.data[0].length) {
                    continue;
                }

                var adjacentTile = this.layer.data[tileIndexPointer.x + i][tileIndexPointer.y + j];
                var currentDistance = Phaser.Math.Distance.Between(adjacentTile.getCenterX(), adjacentTile.getCenterY(), worldPoint.x, worldPoint.y);
                if (currentDistance < minimumDistance) {
                    closestTile = adjacentTile;
                    minimumDistance = currentDistance;
                }


            }

        }

        var point = new Phaser.Math.Vector2(0, 0);


        point.x = closestTile.x;
        point.y = closestTile.y;

        return point;
        //return IsoTileMapComponents.worldToTileXY(worldX, worldY, snapToFloor, point, camera, this.layer);
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

Phaser.Class.mixin(IsoDynamicTileMapLayer, [
    DynamicTileMapRender
]);