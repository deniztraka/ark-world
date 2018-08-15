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

const gameConfig = {
    width: 680,
    height: 400,
    title: 'World.IO', // 'My Phaser 3 Game'    
    version: '0.0.1',
    scene: [BootScene, PreloaderScene, MainMenuScene, SettingsScene, CharacterSelectionScene],
    loader: {
        // baseURL: '',
        path: 'assets/',
        // maxParallelDownloads: 32,
        // crossOrigin: 'anonymous',
        // timeout: 0
    }
};

new Phaser.Game(gameConfig);