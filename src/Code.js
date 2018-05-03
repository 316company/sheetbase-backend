'use strict';

/**
 * 
 * @constructor
 * @param {object} config - Configuration data
 * @param {object} model - Model define
 * @return {boolean}
 * 
*/
function initialize(CONFIG) {
    if(!CONFIG || !(CONFIG instanceof Object))
        throw new Error('Missing or invalid config data.');

    if(!CONFIG.apiKey || !CONFIG.databaseId)
        throw new Error('Config data must contain \'apiKey\' and \'databaseId\' field.');

    var configData = Config.set_(CONFIG);
    var modelData = Model.create_();
    return (configData&&modelData) ? true: false;
}