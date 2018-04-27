/**
* Config Class
* @namespace
*/
var Config = (function (__this) {

    __this.data = {};

    /**
     * Set config
     * @constructor
     * @param {object} data - Object of configuration data
     * @return {ConfigData} 
     * 
    */
    __this.set = function (data) {
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
    __this.get = function (key) {
        var _this = this;
        if(key) return _this.data[key];
        return _this.data;
    }

    return __this;

})(Config||{});