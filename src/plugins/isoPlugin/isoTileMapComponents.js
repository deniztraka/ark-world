import {
    IsoTileMap
} from './isoTileMap';

export function parseToIsoTilemap(scene, key, tileWidth, tileHeight, width, height, data, insertNull) {
    if (tileWidth === undefined) {
        tileWidth = 32;
    }
    if (tileHeight === undefined) {
        tileHeight = 32;
    }
    if (width === undefined) {
        width = 10;
    }
    if (height === undefined) {
        height = 10;
    }
    if (insertNull === undefined) {
        insertNull = false;
    }

    var mapData = null;

    if (Array.isArray(data)) {
        var name = key !== undefined ? key : 'map';
        mapData = Parse(name, Formats.ARRAY_2D, data, tileWidth, tileHeight, insertNull);
    } else if (key !== undefined) {
        var tilemapData = scene.cache.tilemap.get(key);

        if (!tilemapData) {
            console.warn('No map data found for key ' + key);
        } else {
            mapData = Parse(key, tilemapData.format, tilemapData.data, tileWidth, tileHeight, insertNull);
        }
    }

    if (mapData === null) {
        mapData = new Phaser.Tilemaps.MapData({
            tileWidth: tileWidth,
            tileHeight: tileHeight,
            width: width,
            height: height
        });
    }

    return new IsoTileMap(scene, mapData);
}

export function putTileAt(tile, tileX, tileY, recalculateFaces, layer) {
    if (!Phaser.Tilemaps.Components.IsInLayerBounds(tileX, tileY, layer)) {
        return null;
    }
    if (recalculateFaces === undefined) {
        recalculateFaces = true;
    }

    var oldTile = layer.data[tileY][tileX];
    var oldTileCollides = oldTile && oldTile.collides;

    if (tile instanceof Phaser.Tilemaps.Tile) {
        if (layer.data[tileY][tileX] === null) {
            layer.data[tileY][tileX] = new Phaser.Tilemaps.Tile(layer, tile.index, tileX, tileY, tile.width, tile.height);
        }
        layer.data[tileY][tileX].copy(tile);
    } else {
        var index = tile;
        if (layer.data[tileY][tileX] === null) {
            layer.data[tileY][tileX] = new Phaser.Tilemaps.Tile(layer, index, tileX, tileY, layer.tileWidth, layer.tileHeight);
        } else {
            layer.data[tileY][tileX].index = index;
        }
    }

    // Updating colliding flag on the new tile
    var newTile = layer.data[tileY][tileX];
    var collides = layer.collideIndexes.indexOf(newTile.index) !== -1;
    Phaser.Tilemaps.Components.SetCollision(newTile, collides, true, layer);

    // Recalculate faces only if the colliding flag at (tileX, tileY) has changed
    if (recalculateFaces && (oldTileCollides !== newTile.collides)) {
        Phaser.Tilemaps.Components.CalculateFacesAt(tileX, tileY, layer);
    }

    return newTile;
}