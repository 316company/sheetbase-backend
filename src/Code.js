'use strict';

/**
 * 
 * @constructor
 * @param {object} config - Configuration data
 * @return {Router}
 * 
*/
function app(CONFIG) {
    if(CONFIG && !(CONFIG instanceof Object))
        throw new Error('Invalid config data, must be NULL or an object.');

    var configData = Config.set_(CONFIG);
    var modelData = Model.create_();
    return Object.assign(
        Router,
        Config
    );
}