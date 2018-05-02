/**
* Config Class
* @namespace
*/
var Config = (function (_Config) {

    _Config.data_ = {};

    /**
     * Get config
     * @param {string} key - Configuration key
     * @return {ConfigData|ConfigDataValue|null}
     * 
    */
    _Config.get = function (key) {
        var _this = this;
        if(key) return _this.data_[key];
        return _this.data_;
    }

    /**
     * Set config
     * @constructor
     * @param {object} data - Object of configuration data
     * @return {ConfigData} 
     * 
    */
    _Config.set_ = function (data) {
        var _this = this;
        if(!data || !(data instanceof Object)) return; 
        for(var key in data) {
            _this.data_[key] = data[key];
        }

        // auto generate options
        if(!_this.data_.backend) {
            _this.data_.backend = ScriptApp.getService().getUrl();
        }

        return _this.data_;
    }

    return _Config;

})(Config||{});