/**
* Helper Class
* @namespace
*/
var Helper = (function (_Helper) {

  /**
   * Turn object into array
   * @param {object} object - JSON data
   * @return {array}
   */
  _Helper.o2a = function (object) {
    var array = [];
    for (var key in object) {
      if (typeof object[key] === 'object') {
        object[key]['$key'] = key;
      } else {
        object[key] = {
          $key: key,
          value: object[key]
        };
      }
      array.push(object[key]);
    }
    return array;
  }

  /**
   * Turn array into object
   * @param {array} array - input array
   * @return {object}
   */
  _Helper.a2o = function (array) {
    var object = {};
    for(var i = 0; i < (array||[]).length; i++) {
      var item = array[i];
      object[item['key'] || item['slug'] || ('' + item['id']) || ('' + item['#']) || ('' + Math.random() * 1E20)] = item;
    }
    return object;
  }

  /**
   * Generate unique UID
   * @return {string} 28 characters uid
   */
  _Helper.uid = function () {
    var max = 21;
    var ASCII_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
    var lastPushTime = 0;
    var lastRandChars = [];

    var now = new Date().getTime();
    var duplicateTime = (now === lastPushTime);
    lastPushTime = now;
    var timeStampChars = new Array(8);
    var i;
    for (i = 7; i >= 0; i--) {
      timeStampChars[i] = ASCII_CHARS.charAt(now % 64);
      now = Math.floor(now / 64);
    }
    var id = timeStampChars.join('');
    if (!duplicateTime) {
      for (i = 0; i < max; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      for (i = max - 1; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
      }
      lastRandChars[i]++;
    }
    for (i = 0; i < max; i++) {
      id += ASCII_CHARS.charAt(lastRandChars[i]);
    }
    return id.substr(1, 28);
  }

  /**
   * Push id
   * @return {string} 20 chracters push id
   * 
  */
  _Helper.id = function () {
    var _this = this;

    var PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
    var lastPushTime = 0;
    var lastRandChars = [];
    var now = new Date().getTime();
    var duplicateTime = (now === lastPushTime);
    lastPushTime = now;

    var timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      now = Math.floor(now / 64);
    }
    if (now !== 0) _this.id();
    var id = timeStampChars.join('');
    if (!duplicateTime) {
      for (i = 0; i < 12; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
      }
      lastRandChars[i]++;
    }
    for (i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }
    if (id.length != 20) _this.id();
    return id;
  }

  /**
   * Generate guid
   * @return {string}
   */
  _Helper.guid = function () {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  return _Helper;

})(Helper||{});

