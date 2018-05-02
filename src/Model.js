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
        
        // main database
        var spreadsheet = SpreadsheetApp.openById(CONFIG.database);
        TamotsuX.initialize(spreadsheet);
        var sheets = spreadsheet.getSheets();
        for(var i = 0; i < sheets.length; i++) {
            var sheet = sheets[i];
            var sheetName = sheet.getName();

            var modelName = sheetName;
            if(modelName.substr(0,1)==='_') modelName = modelName.substr(1, modelName.length);
            modelName = Pluralize.singular(modelName);
            modelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
            
            _this.data_[modelName] = TamotsuX.Table.define({
                spreadsheet: spreadsheet,
                sheetName: sheetName,
            });
        }

        return _this.data_;
    }

    return _Model;

})(Model||{});