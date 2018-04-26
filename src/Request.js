var Request = {

    /**
     * 
     * 
    */
   param: function (e, key) {
        var params = e.parameter;
        if(key) return params[key];
        return params;
   },



   /**
     * 
     * 
    */
   body: function (e, key) {
        var body = JSON.parse(e.postData ? e.postData.contents: '{}');
        if(key) return body[key];
        return body;
   },



  /**
   * Check authorization status
   * @param {object} e - Event from doGet(), doPost()
   */
  isAuthorized: function (e) {
    var _this = this;
    var apiKey = _this.body(e, 'apiKey') || _this.param(e, 'apiKey');
    return Config.get('apiKey') === apiKey;
  }


};