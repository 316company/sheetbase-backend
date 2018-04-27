/**
* Response Class
* @namespace
*/
var Response = (function (__this) {

    /**
     * Response JSON
     * @param {object} object - JSON data
     * @return {ContentServiceJSONData}
     */
    __this.json = function (object) {
        var JSONString = JSON.stringify(object);
        var JSONOutput = ContentService.createTextOutput(JSONString);
        JSONOutput.setMimeType(ContentService.MimeType.JSON);
        return JSONOutput;
    }


    /**
     * Response HTML
     * @param {string} html - HTML text
     * @return {HtmlServiceHTMLData}
     */
    __this.html = function (html) {
        return HtmlService.createHtmlOutput(html);
    }

    /**
     * return home message
     */
    __this.home = function () {
        var _this = this;
        return _this.json({
            "name": "Sheetbase Backend",
            "homepage": "https://sheetbase.net",
            "docs": "https://sheetbase.net/docs"
        });
    }

    /**
     * Return unauthorization message
     * @return {UnauthorizedMessage}
     */
    __this.unauthorized = function () {
        var _this = this;
        return _this.json({
            error: true,
            code: 'http/403',
            message: 'Unauthorized!'
        });
    }

    return __this;
    
})(Response||{});