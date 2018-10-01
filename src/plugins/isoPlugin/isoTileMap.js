import * as IsoTileMapComponents from './isoTileMapComponents';
import {
    IsoDynamicTileMapLayer
} from './isoDynamicTileMapLayer';
import {
    IsoTile
} from './isoTile';


export class IsoTileMap extends Phaser.Tilemaps.Tilemap {
    constructor(scene, mapData) {
        super(scene, mapData);
    }

    putTileAt(tile, tileX, tileY, recalculateFaces, layer) {
        layer = this.getLayer(layer);

        if (this._isStaticCall(layer, 'putTileAt')) {
            return null;
        }

        if (layer === null) {
            return null;
        }



        return IsoTileMapComponents.putTileAt(tile, tileX, tileY, recalculateFaces, layer);
    }

    removeTileAt(tileX, tileY, replaceWithNull, recalculateFaces, layer) {
        layer = this.getLayer(layer);

        if (this._isStaticCall(layer, 'removeTileAt')) { return null; }

        if (layer === null) { return null; }

        return IsoTileMapComponents.removeTileAt(tileX, tileY, replaceWithNull, recalculateFaces, layer);
    }

    getTileAt(tileX, tileY, nonNull, layer) {
        layer = this.getLayer(layer);

        if (layer === null) {
            return null;
        }

        return IsoTileMapComponents.getTileAt(tileX, tileY, nonNull, layer);
    }

    createBlankDynamicIsoLayer(name, tileset, x, y, width, height, tileWidth, tileHeight) {

        if (tileWidth === undefined) {
            tileWidth = tileset.tileWidth;
        }
        if (tileHeight === undefined) {
            tileHeight = tileset.tileHeight;
        }
        if (width === undefined) {
            width = this.width;
        }
        if (height === undefined) {
            height = this.height;
        }
        if (x === undefined) {
            x = 0;
        }
        if (y === undefined) {
            y = 0;
        }

        var index = this.getLayerIndex(name);

        if (index !== null) {
            console.warn('Cannot create blank layer: layer with matching name already exists ' + name);
            return null;
        }

        var layerData = new Phaser.Tilemaps.LayerData({
            name: name,
            tileWidth: tileWidth,
            tileHeight: tileHeight,
            width: width,
            height: height
        });

        var row;

        for (var tileX = 0; tileX < width; tileX++) {
            row = [];

            for (var tileY = 0; tileY < height; tileY++) {
                row.push(new IsoTile(layerData, -1, tileX, tileY, tileWidth, tileHeight, this.tileWidth, this.tileHeight));
            }

            layerData.data.push(row);
        }

        this.layers.push(layerData);
        this.currentLayerIndex = this.layers.length - 1;

        var dynamicLayer = new IsoDynamicTileMapLayer(this.scene, this, this.currentLayerIndex, tileset, x, y);

        dynamicLayer.setRenderOrder(this.renderOrder);

        this.scene.sys.displayList.add(dynamicLayer);

        if (false) {
            for (let x = 0; x < dynamicLayer.layer.data.length; x++) {
                for (let y = 0; y < dynamicLayer.layer.data[x].length; y++) {
                    var tile = dynamicLayer.layer.data[x][y];
                    var versionText = this.scene.add.text(tile.getCenterX(), tile.getCenterY(), x + "," + y, {
                        font: '10px Courier',
                        fill: '#ffffff'
                    });

                    // var versionText = this.scene.add.text(tile.pixelX, tile.pixelY, x + "," + y + " ; " + tile.getCenterX() + "," + tile.getCenterY(), {
                    //     font: '10px Courier',
                    //     fill: '#ffffff'
                    // });

                    // var versionText = this.scene.add.text(tile.pixelX, tile.pixelY, x + "," + y, {
                    //     font: '10px Courier',
                    //     fill: '#ffffff'
                    // });
                    versionText.setOrigin(0.5, 0.5);


                }
            }





        }

        return dynamicLayer;
    }



}