import {
    IsoTileMap
} from './isoTileMap';

import * as IsoTileMapComponents from './isoTileMapComponents';

export class IsoPlugin extends Phaser.Plugins.ScenePlugin {
    constructor(scene, pluginManager) {
        super(scene, pluginManager);

    }

    init() {

    }

    //  Called when the Plugin is booted by the PluginManager.
    //  If you need to reference other systems in the Scene (like the Loader or DisplayList) then set-up those references now, not in the constructor.
    boot() {

        let eventEmitter = this.systems.events;
        eventEmitter.on('update', this.update, this);

        Phaser.GameObjects.GameObjectCreator.register('isoTileMap', function(config) {

            // Defaults are applied in ParseToTilemap
            var c = (config !== undefined) ? config : {};

            return IsoTileMapComponents.parseToIsoTilemap(
                this.scene,
                c.key,
                c.tileWidth,
                c.tileHeight,
                c.width,
                c.height,
                c.data,
                c.insertNull
            );
        });

        /* 
            List of unused eventEmitters to activate matching methods of this plugin
            start
            ready
            preupdate
            update
            postupdate
            resize
            pause
            resume
            sleep
            wake
            transitioninit
            transitionstart
            transitioncomplete
            transitionout
            shutdown
            destroy

            var eventEmitter = this.systems.events;
            eventEmitter.once('destroy', this.sceneDestroy, this);
        */

        //eventEmitter.on('start', this.start, this);

        //eventEmitter.on('preupdate', this.preUpdate, this);
        //eventEmitter.on('postupdate', this.postUpdate, this);

        //eventEmitter.on('pause', this.pause, this);
        //eventEmitter.on('resume', this.resume, this);

        //eventEmitter.on('sleep', this.sleep, this);
        //eventEmitter.on('wake', this.wake, this);

        //eventEmitter.on('shutdown', this.shutdown, this);
        //eventEmitter.on('destroy', this.destroy, this);*/
    }

    //  Called when a Scene is started by the SceneManager. The Scene is now active, visible and running.
    start() {}

    //  Called every Scene step - phase 1
    preUpdate(time, delta) {}

    //  Called every Scene step - phase 2
    update(time, delta) {

    }

    //  Called every Scene step - phase 3
    postUpdate(time, delta) {}

    //  Called when a Scene is paused. A paused scene doesn't have its Step run, but still renders.
    pause() {}

    //  Called when a Scene is resumed from a paused state.
    resume() {}

    //  Called when a Scene is put to sleep. A sleeping scene doesn't update or render, but isn't destroyed or shutdown. preUpdate events still fire.
    sleep() {}

    //  Called when a Scene is woken from a sleeping state.
    wake() {}

    //  Called when a Scene shuts down, it may then come back again later (which will invoke the 'start' event) but should be considered dormant.
    shutdown() {}

    //  Called when a Scene is destroyed by the Scene Manager. There is no coming back from a destroyed Scene, so clear up all resources here.
    destroy() {
        this.shutdown();
        this.scene = undefined;
    }

    // //  Custom method for this plugin
    // setDelay(delay) {
    //     this.countDelay = delay;
    // }

    // //  Custom method for this plugin
    // reset() {
    //     this.counter = 0;
    //     this.text.setText(0);
    // }


}