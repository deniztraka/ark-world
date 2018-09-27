var IsoHeight = {
    z: {
        _z: 0,

        get: function() {
            if (!this._z) {
                this._z = 0;
            }
            return this._z;
        },

        set: function(value) {
            this._z = value;
        }

    }
}

export default IsoHeight;