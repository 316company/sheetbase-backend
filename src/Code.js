'use strict';

/**
 * 
 * @constructor
 * @param {object} config - Configuration data
 * @param {object} model - Model define
 * @return {boolean}
 * 
*/
function initialize(SHEETBASE_CONFIG, MODEL_CONFIG, APP_CONFIG) {
    if(!SHEETBASE_CONFIG || !MODEL_CONFIG)
        throw new Error('Missing config data.');
    
    if(!(SHEETBASE_CONFIG instanceof Object) || !(MODEL_CONFIG instanceof Object))
        throw new Error('Invalid config data.');

    if(!SHEETBASE_CONFIG.apiKey || !SHEETBASE_CONFIG.database || !SHEETBASE_CONFIG.backend)
        throw new Error('Config data must contain \'apiKey\', \'database\' and \'backend\' field.');

    var ALL_CONFIG = SHEETBASE_CONFIG; 
    if(APP_CONFIG && (APP_CONFIG instanceof Object)) {
        for(var key in APP_CONFIG) {
            ALL_CONFIG[key] = APP_CONFIG[key];
        }
    }

    var configData = Config.set(ALL_CONFIG);
    var modelData = Model.create(MODEL_CONFIG);
    return (configData&&modelData) ? true: false;
}