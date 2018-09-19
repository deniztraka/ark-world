import * as IsoTileMapComponents from './isoTileMapComponents';
import { IsoDynamicTileMapLayer } from './isoDynamicTileMapLayer';

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

        for (var tileY = 0; tileY < height; tileY++) {
            row = [];

            for (var tileX = 0; tileX < width; tileX++) {
                row.push(new Phaser.Tilemaps.Tile(layerData, -1, tileX, tileY, tileWidth, tileHeight, this.tileWidth, this.tileHeight));
            }

            layerData.data.push(row);
        }

        this.layers.push(layerData);
        this.currentLayerIndex = this.layers.length - 1;

        var dynamicLayer = new IsoDynamicTileMapLayer(this.scene, this, this.currentLayerIndex, tileset, x, y);

        dynamicLayer.setRenderOrder(this.renderOrder);

        this.scene.sys.displayList.add(dynamicLayer);

        return dynamicLayer;
    }



}