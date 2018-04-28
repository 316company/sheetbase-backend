/**
* Model Class
* @namespace
*/
var Model = (function (_Model) {

    _Model.data = {};



    /**
     * Create models
     * @constructor
     * @param {object} data - Object of model data
     * @return {ModelData}
     * 
    */
    _Model.create = function (data) {
        var _this = this;

        if(!data || !(data instanceof Object)) return;
        
        TamotsuX.initialize(SpreadsheetApp.openById(Config.get('database')));
        for(var key in data) {
            if(!data[key] || !(data[key] instanceof Object)) continue;
            var spreadsheetId = Config.get(key);
            for(var key2 in data[key]) {
                _this.data[key2] = TamotsuX.Table.define({
                    spreadsheet: spreadsheetId ? SpreadsheetApp.openById(spreadsheetId): null,
                    sheetName: data[key][key2],
                });
            }
        }
        return _this.data;
    }


    /**
     * GET MODEL DATA
     * @param {string} key - Model key
     * @return {ModelData|ModelDataValue|null}
     * 
    */
    _Model.get = function (key) {
        var _this = this;
        if(key) return _this.data[key];
        return _this.data;
    }

    return _Model;

})(Model||{});