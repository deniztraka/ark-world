/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var renderWebGL = require('../../../node_modules/phaser/src/utils/NOOP');
var renderCanvas = require('../../../node_modules/phaser/src/utils/NOOP');

if (typeof WEBGL_RENDERER) {
    renderWebGL = require('./DynamicTilemapLayerWebGLRenderer');
}

if (typeof CANVAS_RENDERER) {
    renderCanvas = require('./DynamicTilemapLayerCanvasRenderer');
}

module.exports = {

    renderWebGL: renderWebGL,
    renderCanvas: renderCanvas

};