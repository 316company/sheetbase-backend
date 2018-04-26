var Response = {

    /**
     * Response JSON data
     * @param {object} object - JSON data
     */
    json: function (object) {
        var JSONString = JSON.stringify(object);
        var JSONOutput = ContentService.createTextOutput(JSONString);
        JSONOutput.setMimeType(ContentService.MimeType.JSON);
        return JSONOutput;
    },


    /**
     * 
     * @param {string} html - HTML text
     */
    html: function (html) {
        return ContentService.createTextOutput(html);
    },


    /**
     * Return unauthorization message
     */
    unauthorized: function () {
        var _this = this;
        return _this.json({
            error: true,
            code: 'http/403',
            message: 'Unauthorized!'
        });
    },

};