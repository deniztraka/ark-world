import 'phaser';

import {
    BootScene
} from './scenes/boot';
import {
    PreloaderScene
} from './scenes/preloader';
import {
    MainMenuScene
} from './scenes/mainMenuScene';
import {
    SettingsScene
} from './scenes/settingsScene';
import {
    CharacterSelectionScene
} from './scenes/characterSelectionScene';
import {
    GameScene
} from './scenes/gameScene';
import {
    IsoPlugin
} from './plugins/isoPlugin/isoPlugin';

const gameConfig = {
    type: Phaser.WEBGL,
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    title: 'World.IO', // 'My Phaser 3 Game'    
    version: '0.0.1',
    plugins: {
        scene: [
            { key: 'IsoPlugin', plugin: IsoPlugin, mapping: 'isoPlugin' },

        ]
    },
    scene: [BootScene, PreloaderScene, MainMenuScene, SettingsScene, CharacterSelectionScene, GameScene],
    loader: {
        // baseURL: '',
        path: 'assets/',
        // maxParallelDownloads: 32,
        // crossOrigin: 'anonymous',
        // timeout: 0
    }
};

var mygame = new Phaser.Game(gameConfig);