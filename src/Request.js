/**
* Request Class
* @namespace
*/
var Request = (function (_Request) {

  /**
   * Get param
   * @param {object} e - Event from doGet(), doPost()
   * @param {string} key - param key
   * @return {RequestQueryData|null}
  */
  _Request.param = function (e, key) {
    if(!e) return;
    var params = e.parameter;
    if (key) return params[key];
    return params;
  }

  /**
    * 
    * @param {object} e - Event from doGet(), doPost()
    * @param {string} key - body key
    * @return {RequestBodyData|null}
   */
  _Request.body = function (e, key) {
    if(!e) return;
    var body = JSON.parse(e.postData ? e.postData.contents : '{}');
    if (key) return body[key];
    return body;
  }

  /**
   * Check authorization status
   * @param {object} e - Event from doGet(), doPost()
   * @return {boolean}
   */
  _Request.isAuthorized = function (e) {
    var _this = this;
    if(!e) return;
    var apiKey = _this.body(e, 'apiKey') || _this.param(e, 'apiKey');
    return Config.get('apiKey') === apiKey;
  }

  return _Request;

})(Request||{});