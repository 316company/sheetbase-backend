var Model = {

    /**
     * MODEL DATA
     * 
    */
    _data_: {},



    /**
     * CREATE MODELS
     * @constructor
     * @param {object} data - Object of model data
     * 
    */
    create: function (data) {
        var _this = this;

        // TODO: validate data
        
        TamotsuX.initialize(SpreadsheetApp.openById(Config.get('database')));
        for(var key in data) {
            var spreadsheet = SpreadsheetApp.openById(Config.get(key));
            for(var key2 in data[key]) {
                _this._data_[key2] = TamotsuX.Table.define({
                    spreadsheet: spreadsheet,
                    sheetName: data[key][key2],
                });
            }
        }
        return _this._data_;
    },


    /**
     * GET MODEL DATA
     * @param {string} key - Model key
     * 
    */
    get: function (key) {
        var _this = this;
        if(key) return _this._data_[key];
        return _this._data_;
    }
}