import 'phaser';
import io from 'socket.io-client';



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
    CreateWorldScene
} from './scenes/createWorldScene';
import {
    GameScene
} from './scenes/gameScene';

import {
    LoginScreen
} from './scenes/loginScreen';
// import {
//     IsoPlugin
// } from './plugins/isoPlugin/isoPlugin';

import {
    IsoPlugin
} from './plugins/rotatesIso/isoPlugin';

import
IsoPhysics
from './plugins/rotatesIso/isoPlugin';

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
            { key: 'IsoPhysics', plugin: IsoPhysics, mapping: 'isoPhysics' },

        ]
    },
    scene: [BootScene, PreloaderScene, LoginScreen, MainMenuScene, SettingsScene, CharacterSelectionScene, GameScene, CreateWorldScene],
    loader: {
        // baseURL: '',
        path: 'assets/',
        // maxParallelDownloads: 32,
        // crossOrigin: 'anonymous',
        // timeout: 0
    }
};

var mygame = new Phaser.Game(gameConfig);

const socket = io('http://localhost:8080');