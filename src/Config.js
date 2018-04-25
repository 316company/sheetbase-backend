var Config = {

    /**
     * CONFIG DATA
     * 
    */
    _data_: {},



    /**
     * SET CONFIG DATA
     * @constructor
     * @param {object} data - Object of configuration data
     * 
    */
    set: function (data) {
        var _this = this;

        // TODO: validate data

        for(var key in data) {
            _this._data_[key] = data[key];
        }
        return _this._data_;
    },


    /**
     * GET CONFIG DATA
     * @param {string} key - Configuration key
     * 
    */
    get: function (key) {
        var _this = this;
        if(key) return _this._data_[key];
        return _this._data_;
    }
}