/**
* Config Class
* @namespace
*/
var Config = (function (_Config) {

    _Config.data = {};

    /**
     * Set config
     * @constructor
     * @param {object} data - Object of configuration data
     * @return {ConfigData} 
     * 
    */
    _Config.set = function (data) {
        var _this = this;

        if(!data || !(data instanceof Object)) return; 

        for(var key in data) {
            _this.data[key] = data[key];
        }
        return _this.data;
    }

    /**
     * Get config
     * @param {string} key - Configuration key
     * @return {ConfigData|ConfigDataValue|null}
     * 
    */
    _Config.get = function (key) {
        var _this = this;
        if(key) return _this.data[key];
        return _this.data;
    }

    return _Config;

})(Config||{});