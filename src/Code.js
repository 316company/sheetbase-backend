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

    Config.set_(CONFIG);
    Model.create_();
    return App;
}