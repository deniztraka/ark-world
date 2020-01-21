import {
    Biomes
} from '../data/biomes';

function getBiomeTextureKey(biome) {

    return "tree_"+biome;

    switch (biome) {
        case Biomes.TropicalSeasonalForest:
            return 'tree_TropicalSeasonalForest';
        case Biomes.TropicalRainForest:
            return 'tree_TropicalRainForest';
        case Biomes.TemperateRainForest:
            return 'tree_TemperateRainForest';
        case Biomes.TemperateDesert:
            return 'tree_TemperateDesert';
        case Biomes.TemperateDeciduousForest:
            return 'tree_TemperateDeciduousForest';
        case Biomes.Taiga:
            return 'tree_Taiga';
        case Biomes.SubtropicalDesert:
            return 'tree_SubtropicalDesert';
        case Biomes.Shrubland:
            return 'tree_Shrubland';

        case Biomes.GrassLand:
            return 'tree_GrassLand';
        // default: return Math.random() > 0.5 ? 'tree1' : 'tree2';
        default:
            return 'tree';
    }
}

export class Tree extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, biome) {
        super(scene, (x * 16) + 8, (y * 16) + 8);

        this.biome = biome;
        var biomeTextureKey = getBiomeTextureKey(biome);
        //console.log(biomeTextureKey);

        this.setTexture(biomeTextureKey);
        //this.setPosition(x, y);
        this.setOrigin(0.5, 0.9);
        this.depth = y;

        scene.add.existing(this);
        this.tint = 0xcccccc;


        //origin poin debugger
        // var graphics = scene.add.graphics();
        // graphics.fillStyle(0x00ff00, 1);
        // graphics.fillCircle((x * 16) + 8, (y * 16) + 8, 3);    

        
    }
}