/**
* Model Class
* @namespace
*/
var Model = (function (_Model) {

    _Model.data_ = {};

    /**
     * GET MODEL DATA
     * @param {string} key - Model key
     * @return {ModelData|ModelDataValue|null}
     * 
    */
   _Model.get = function (key) {
        var _this = this;
        if(key) return _this.data_[key];
        return _this.data_;
    }

    /**
     * Create models
     * @constructor
     * @param {object} data - Object of model data
     * @return {ModelData}
     * 
    */
    _Model.create_ = function () {
        var _this = this;
        var CONFIG = Config.get();

        var databases = [];
        for(var key in CONFIG) {
            if(key.toLowerCase().indexOf('database') > -1) databases.push(CONFIG[key]);
        }
        
        TamotsuX.initialize(SpreadsheetApp.openById(CONFIG.database));
        for(var i = 0; i < databases.length; i++) {
            var spreadsheetId = databases[i];
            var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
            var sheets = spreadsheet.getSheets();
            for(var j = 0; j < sheets.length; j++) {
                var sheet = sheets[j];
                var sheetName = sheet.getName();
                var modelName = Pluralize.singular(sheetName);
                    modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
                
                _this.data_[modelName] = TamotsuX.Table.define({
                    spreadsheet: spreadsheet,
                    sheetName: sheetName,
                });
            }
        }

        return _this.data_;
    }

    return _Model;

})(Model||{});