/**
 * Load external libs
 */
var navigator = {}; var window = {};
// jsrsasign
eval(UrlFetchApp.fetch('https://kjur.github.io/jsrsasign/jsrsasign-latest-all-min.js').getContentText());



/**
 * 
 * @constructor
 * @param {object} config - Configuration data
 * @param {object} model - Model define
 * 
*/
function initialize(config, model) {
    var configData = Config.set(config);
    var modelData = Model.create(model);
    return (configData&&modelData) ? true: false;
}