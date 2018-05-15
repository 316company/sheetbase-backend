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
    var params = e.parameter||{};
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

  return _Request;

})(Request||{});