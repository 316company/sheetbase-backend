/**
 * Data
 * @namespace
 */
var Data = (function (_Data) {
    
    // TODO: Custom modifiers

    _Data.get = function (path) {
        var _this = this;

        if (!path) return AppError.client(
            'data/no-data-path',
            'You must give the data path!'
        );

        // process the path
        var pathSplits = path.split('/').filter(Boolean);
        var masterPath = pathSplits.splice(0, 1)[0];

        if (masterPath.substr(0,1) === '_') return AppError.client(
            'data/private-data',
            'Can not get private data!'
        );

        // get master data & return data
        var data = {};
        try {
            var spreadsheet = SpreadsheetApp.openById(Config.get('databaseId'));
            var range = spreadsheet.getRange(masterPath + '!A1:ZZ');
            var values = range.getValues();
            var masterData = _this._transform_(values);
            data = ObjectPath.objectPath.get(masterData, pathSplits);
        } catch(error) {
            return AppError.server(
                'data/unknown',
                'Errors getting data!'
            );
        }
        return data;
    }

    _Data.object = function (path) {
        var _this = this;
        return _this.get(path);
    }

    _Data.list = function (path) {
        var _this = this;
        var data = _this.get(path);
        return !data.error ? Helper.o2a(data): data;
    }

    _Data.update = function (updates) {
        var _this = this;

        if (!updates) return AppError.client(
            'data/no-data',
            'You must give the updates!'
        );

        var status = {};
        var models = {};
        var masterDataGroup = {};
        for (var path in updates) {
            var pathSplits = path.split('/').filter(Boolean);
            var masterPath = pathSplits.splice(0, 1)[0];
            var itemId = pathSplits[0];

            if (!models[masterPath]) {
                models[masterPath] = Model.get(masterPath);
            }
            if (!masterDataGroup[masterPath]) {
                masterDataGroup[masterPath] = _this.get(masterPath);
            }

            if (itemId) {
                try {
                    // update data in RAM
                    ObjectPath.objectPath.set(masterDataGroup[masterPath], pathSplits, updates[path]);
        
                    // update in sheet
                    var item = models[masterPath].where(function (itemInDB) {
                        return (itemInDB['key'] === itemId) ||
                        (itemInDB['slug'] === itemId) ||
                        ((itemInDB['id'] + '') === itemId) ||
                        ((itemInDB['#'] + '') === itemId);
                    }).first();

                    
                    var updatedData = Object.assign({}, masterDataGroup[masterPath][itemId]);
                    for (var key in updatedData) {
                        if (updatedData[key] instanceof Object) {
                            updatedData[key] = JSON.stringify(updatedData[key]);
                        }
                    }

                    if (item) {
                        Object.assign(item, updatedData);
                    } else {
                        item = models[masterPath].create(updatedData);
                    }
                    item.save();

                    // update the status
                    status[path] = true;
                } catch(error) {
                    // ignore the action
                    status[path] = false;
                }
            } else {
                // else: ignore the action
                status[path] = false;
            }
        }

        return {
            status: status
        };
    }



    /**
     * Turn [][] -> [{},{}, ...]
     * @param {Array} values - Data[][]
     * @param {boolean} noHeaders - Has header row?
     */
    _Data._transform_ = function (values, noHeaders) {
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
            if (Object.keys(item).length > 0) items.push(_this._finalize_(item));
        }
        return Helper.a2o(items);
    }


  /**
   * Typed modification cell data
   * @param {object} item - Data in JSON
   * @return {object}
   */
  _Data._finalize_ = function (item) {
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