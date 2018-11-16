export class BaseMenuItem extends Phaser.GameObjects.Text {
    constructor(_scene, _x, _y, _text) {
        if (new.target === BaseMenuItem) {
            throw new TypeError("Cannot construct BaseMenuItem instances directly");
        }

        var style = {
            fontSize: '26px',
            fill: '#CCC',
            shadowBlur: 3,
            shadowColor: 'white',
            shadowFill: true
        };

        super(_scene, _x, _y, _text, style);
        _scene.add.displayList.add(this);
    }
}