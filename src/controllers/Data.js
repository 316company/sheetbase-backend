/**
 * Data Class
 * @namespace
 */
var Data = (function (_Data) {

    // TODO: Custom modifiers

    _Data.get = function (tableName, customRange) {
        var _this = this;
        if(!tableName)
            return AppError.make(
                'data/no-table-name',
                'You must give the table name!'
            );
        
        if(tableName.substr(0,1)==='_')
            return AppError.make(
                'data/private-data',
                'Can not get private data!'
            );

        try {
            var spreadsheet = SpreadsheetApp.openById(Config.get('database'));
            var range = spreadsheet.getRange(tableName +'!'+ (customRange||'A1:ZZ'));
            var values = range.getValues();
            return _this.transform(values);
        } catch(error) {
            return {};
        }
    }

    /**
     * Turn [][] -> [{},{}, ...]
     * @param {Array} values - Data[][]
     * @param {boolean} noHeaders - Has header row?
     */
    _Data.transform = function (values, noHeaders) {
        var _this = this;
        var items = [];

        var headers = ['value'];
        var data = values || [];
        if (!noHeaders) {
            headers = values[0] || [],
                data = values.slice(1, values.length) || [];
        }
        for (var i = 0; i < data.length; i++) {
            var rows = data[i];
            var item = {};

            for (var j = 0; j < rows.length; j++) {
                if (rows[j]) {
                    var val = rows[j];
                    item[headers[j] || (headers[0] + j)] = val;
                }
            }
            if (Object.keys(item).length > 0) items.push(_this.finalize(item));
        }
        return Helper.a2o(items);
    }


  /**
   * Typed modification cell data
   * @param {object} item - Data in JSON
   * @return {object}
   */
  _Data.finalize = function (item) {
    for (var key in item) {
      //transform JSON where possible
      try {
        item[key] = JSON.parse(item[key]);
      } catch (e) { }

      // transform number
      if (!isNaN(item[key]) && Number(item[key]) % 1 === 0) item[key] = parseInt(item[key]);
      if (!isNaN(item[key]) && Number(item[key]) % 1 !== 0) item[key] = parseFloat(item[key]);

      // transform boolean value
      if (typeof item[key] === 'string' || item[key] instanceof String) item[key] = ((item[key]).toLowerCase() === 'true') || ((item[key]).toLowerCase() === 'false' ? false : item[key]);

      // delete null key
      if (item[key] === '' || item[key] === null || item[key] === undefined) {
        delete item[key];
      }
    }
    return item;
  }

  return _Data;

})(Data||{});