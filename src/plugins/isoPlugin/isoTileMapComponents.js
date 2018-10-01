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

    var oldTile = layer.data[tileX][tileY];
    var oldTileCollides = oldTile && oldTile.collides;

    if (tile instanceof Phaser.Tilemaps.Tile) {
        if (layer.data[tileX][tileY] === null) {
            layer.data[tileX][tileY] = new IsoTile(layer, tile.index, tileX, tileY, tile.width, tile.height);
        }
        layer.data[tileX][tileY].copy(tile);
    } else {
        var index = tile;
        if (layer.data[tileX][tileY] === null) {
            layer.data[tileX][tileY] = new IsoTile(layer, index, tileX, tileY, layer.tileWidth, layer.tileHeight);
        } else {
            layer.data[tileX][tileY].index = index;
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

    return layerWorldY + ((tile.x + tile.y) * (tileHeight / 4));

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
        worldX = worldX + (tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX));
        worldY = worldY + (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileWidth *= tilemapLayer.scaleX;
    }

    return snapToFloor ?
        Math.floor(worldX / tileWidth) :
        (Math.floor(worldX / (tileWidth / 2)) + (Math.floor(worldY / (tileHeight / 4)))) / 2;


}

export function worldToTileY(worldX, worldY, snapToFloor, camera, layer) {
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
        worldX = worldX + (tilemapLayer.x + camera.scrollX * (1 - tilemapLayer.scrollFactorX));
        worldY = worldY + (tilemapLayer.y + camera.scrollY * (1 - tilemapLayer.scrollFactorY));

        tileHeight *= tilemapLayer.scaleY;
    }
    debugger;

    return snapToFloor ?
        Math.floor(worldY / tileHeight) :
        (Math.floor(worldY / (tileHeight / 4)) - (Math.floor(worldX / (tileWidth / 2)))) / 2;


}

export function worldToTileXY(worldX, worldY, snapToFloor, point, camera, layer) {
    if (point === undefined) {
        point = new Phaser.Math.Vector2(0, 0);
    }

    point.x = Math.floor(worldToTileX(worldX, worldY, snapToFloor, camera, layer));
    point.y = Math.floor(worldToTileY(worldX, worldY, snapToFloor, camera, layer));

    return point;
}

export function getTileAt(tileX, tileY, nonNull, layer) {
    if (nonNull === undefined) {
        nonNull = false;
    }

    if (isInLayerBounds(tileX, tileY, layer)) {
        var tile = layer.data[tileX][tileY];
        if (tile === null) {
            return null;
        } else if (tile.index === -1) {
            return nonNull ? tile : null;
        } else {
            return tile;
        }
    } else {
        return null;
    }
}

export function isInLayerBounds(tileX, tileY, layer) {
    return (tileX >= 0 && tileX < layer.width && tileY >= 0 && tileY < layer.height);
}


export function cullTiles(layer, camera, outputArray, renderOrder) {
    if (outputArray === undefined) {
        outputArray = [];
    }
    if (renderOrder === undefined) {
        renderOrder = 0;
    }

    outputArray.length = 0;

    var tilemap = layer.tilemapLayer.tilemap;
    var tilemapLayer = layer.tilemapLayer;

    var mapData = layer.data;
    var mapWidth = layer.width;
    var mapHeight = layer.height;

    //  We need to use the tile sizes defined for the map as a whole, not the layer,
    //  in order to calculate the bounds correctly. As different sized tiles may be
    //  placed on the grid and we cannot trust layer.baseTileWidth to give us the true size.
    var tileW = Math.floor(tilemap.tileWidth * tilemapLayer.scaleX);
    var tileH = Math.floor(tilemap.tileHeight * tilemapLayer.scaleY);

    var drawLeft = 0;
    var drawRight = mapWidth;
    var drawTop = 0;
    var drawBottom = mapHeight;

    if (!tilemapLayer.skipCull && tilemapLayer.scrollFactorX === 1 && tilemapLayer.scrollFactorY === 1) {
        //  Camera world view bounds, snapped for scaled tile size
        //  Cull Padding values are given in tiles, not pixels

        var boundsLeft = Phaser.Math.Snap.Floor(camera.worldView.x - tilemapLayer.x, tileW, 0, true) - tilemapLayer.cullPaddingX;
        var boundsRight = Phaser.Math.Snap.Ceil(camera.worldView.right - tilemapLayer.x, tileW, 0, true) + tilemapLayer.cullPaddingX;
        var boundsTop = Phaser.Math.Snap.Floor(camera.worldView.y - tilemapLayer.y, tileH, 0, true) - tilemapLayer.cullPaddingY;
        var boundsBottom = Phaser.Math.Snap.Ceil(camera.worldView.bottom - tilemapLayer.y, tileH, 0, true) + tilemapLayer.cullPaddingY;

        drawLeft = Math.max(0, boundsLeft);
        drawRight = Math.min(mapWidth, boundsRight);
        drawTop = Math.max(0, boundsTop);
        drawBottom = Math.min(mapHeight, boundsBottom);
    }

    var x;
    var y;
    var tile;

    if (renderOrder === 0) {
        //  right-down

        for (y = drawTop; y < drawBottom; y++) {
            for (x = drawLeft; x < drawRight; x++) {
                tile = mapData[y][x];

                if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0) {
                    continue;
                }

                outputArray.push(tile);
            }
        }
    } else if (renderOrder === 1) {
        //  left-down

        for (y = drawTop; y < drawBottom; y++) {
            for (x = drawRight; x >= drawLeft; x--) {
                tile = mapData[y][x];

                if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0) {
                    continue;
                }

                outputArray.push(tile);
            }
        }
    } else if (renderOrder === 2) {
        //  right-up

        for (y = drawBottom; y >= drawTop; y--) {
            for (x = drawLeft; x < drawRight; x++) {
                tile = mapData[y][x];

                if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0) {
                    continue;
                }

                outputArray.push(tile);
            }
        }
    } else if (renderOrder === 3) {
        //  left-up

        for (y = drawBottom; y >= drawTop; y--) {
            for (x = drawRight; x >= drawLeft; x--) {
                tile = mapData[y][x];

                if (!tile || tile.index === -1 || !tile.visible || tile.alpha === 0) {
                    continue;
                }

                outputArray.push(tile);
            }
        }
    }

    tilemapLayer.tilesDrawn = outputArray.length;
    tilemapLayer.tilesTotal = mapWidth * mapHeight;

    return outputArray;
}

export function cullIsoTiles(layer, camera, outputArray, renderOrder) {
    if (outputArray === undefined) {
        outputArray = [];
    }
    if (renderOrder === undefined) {
        renderOrder = 0;
    }

    outputArray.length = 0;

    var tilemap = layer.tilemapLayer.tilemap;
    var tilemapLayer = layer.tilemapLayer;

    var mapData = layer.data;
    var mapWidth = layer.width;
    var mapHeight = layer.height;

    //  We need to use the tile sizes defined for the map as a whole, not the layer,
    //  in order to calculate the bounds correctly. As different sized tiles may be
    //  placed on the grid and we cannot trust layer.baseTileWidth to give us the true size.
    var tileW = Math.floor(tilemap.tileWidth * tilemapLayer.scaleX);
    var tileH = Math.floor(tilemap.tileHeight * tilemapLayer.scaleY);



    for (let x = 0; x < mapData.length; x++) {
        const row = mapData[x];
        for (let y = 0; y < row.length; y++) {
            const tile = row[y];
            var centerX = tile.getCenterX();
            var centerY = tile.getCenterY();
            if (centerX > camera.worldView.x - tile.width && centerX < camera.worldView.x + camera.worldView.width + tile.width &&
                centerY > camera.worldView.y - tile.height / 2 && centerY < camera.worldView.y + camera.worldView.height + tile.height / 2) {
                outputArray.push(tile);
            }

        }

    }

    tilemapLayer.tilesDrawn = outputArray.length;
    tilemapLayer.tilesTotal = mapWidth * mapHeight;
    return outputArray;
}