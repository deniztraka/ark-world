
// timer event
class TimerEvent {
    constructor(timer, type, time, callback, thisContext, args) {
        this.id = ++timer.idCounter;
        this.timer = timer;
        this.type = type;
        this.time = time;
        this.callback = callback;
        this.startOffset = timer.currentTime;
        this.thisContext = thisContext;
        this.args = args;

        this.destroy = function () {
            this.timer.destroy(this.id);
        };
    }
}

TimerEvent.TYPES = {
    repeat: 'repeat',
    single: 'single'
};

module.exports = TimerEvent;