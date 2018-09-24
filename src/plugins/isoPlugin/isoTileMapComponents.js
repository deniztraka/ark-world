import {
    IsoTileMap
} from './isoTileMap';
import {
    IsoTile
} from './isoTile';

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
            layer.data[tileY][tileX] = new IsoTile(layer, tile.index, tileX, tileY, tile.width, tile.height);
        }
        layer.data[tileY][tileX].copy(tile);
    } else {
        var index = tile;
        if (layer.data[tileY][tileX] === null) {
            layer.data[tileY][tileX] = new IsoTile(layer, index, tileX, tileY, layer.tileWidth, layer.tileHeight);
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

export function tileToWorldX(tile, camera, layer) {
    var tileWidth = layer.baseTileWidth;
    var tilemapLayer = layer.tilemapLayer;
    var layerWorldX = 0;

    if (tilemapLayer) {
        if (camera === undefined) {
            camera = tilemapLayer.scene.cameras.main;
        }

        layerWorldX = tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX);

        tileWidth *= tilemapLayer.scaleX;
    }

    return layerWorldX + ((tile.x - tile.y) * (tileWidth / 2));
}

export function tileToWorldY(tile, camera, layer) {
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;
    var layerWorldY = 0;

    if (tilemapLayer) {
        if (camera === undefined) {
            camera = tilemapLayer.scene.cameras.main;
        }

        layerWorldY = (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileHeight *= tilemapLayer.scaleY;
    }

    return layerWorldY + ((tile.x + tile.y) * (tileHeight / 2));

}

export function tileToWorldXY(tile, point, camera, layer) {
    if (point === undefined) {
        point = new Phaser.Math(0, 0);
    }

    point.x = tileToWorldX(tile, camera, layer);
    point.y = tileToWorldY(tile, camera, layer);

    return point;
}

export function worldToTileX(worldX, worldY, snapToFloor, camera, layer) {

    if (snapToFloor === undefined) {
        snapToFloor = true;
    }

    var tileWidth = layer.baseTileWidth;
    var tileHeight = layer.baseTileHeight;
    var tilemapLayer = layer.tilemapLayer;

    if (tilemapLayer) {
        if (camera === undefined) {
            camera = tilemapLayer.scene.cameras.main;
        }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's horizontal scroll
        worldX = worldX + (tilemapLayer.x + camera.scrollX); //* (1 - tilemapLayer.scrollFactorX));
        worldY = worldY + (tilemapLayer.y + camera.scrollY);

        tileWidth *= tilemapLayer.scaleX;
    }

    return snapToFloor ?
        Math.floor(worldX / tileWidth) :
        (Math.floor(worldX / (tileWidth / 2)) + (Math.floor(worldY / (tileHeight / 2)))) / 2;

}

export function worldToTileY(worldX, worldY, snapToFloor, camera, layer) {
    debugger;
    if (snapToFloor === undefined) {
        snapToFloor = true;
    }

    var tileHeight = layer.baseTileHeight;
    var tileWidth = layer.baseTileWidth;
    var tilemapLayer = layer.tilemapLayer;

    if (tilemapLayer) {
        if (camera === undefined) {
            camera = tilemapLayer.scene.cameras.main;
        }

        // Find the world position relative to the static or dynamic layer's top left origin,
        // factoring in the camera's vertical scroll
        worldY = worldY + (tilemapLayer.y + camera.scrollY); //* (1 - tilemapLayer.scrollFactorY));
        worldX = worldX + (tilemapLayer.x + camera.scrollX);

        tileHeight *= tilemapLayer.scaleY;
    }


    return snapToFloor ?
        Math.floor(worldY / tileHeight) :
        (Math.floor(worldY / (tileHeight / 2)) - (Math.floor(worldX / (tileWidth / 2)))) / 2;
}

export function worldToTileXY(worldX, worldY, snapToFloor, point, camera, layer) {
    if (point === undefined) {
        point = new Phaser.Math.Vector2(0, 0);
    }

    point.x = Math.floor(worldToTileX(worldX, worldY, snapToFloor, camera, layer));
    point.y = Math.floor(worldToTileY(worldX, worldY, snapToFloor, camera, layer));

    return point;
}