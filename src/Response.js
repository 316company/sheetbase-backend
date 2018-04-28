/**
* Response Class
* @namespace
*/
var Response = (function (_Response) {

    /**
     * Response JSON
     * @param {object} object - JSON data
     * @return {ContentServiceJSONData}
     */
    _Response.json = function (object) {
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
    _Response.html = function (html) {
        return HtmlService.createHtmlOutput(html);
    }

    /**
     * return home message
     */
    _Response.home = function () {
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
    _Response.unauthorized = function () {
        var _this = this;
        return _this.json({
            error: true,
            code: 'http/403',
            message: 'Unauthorized!'
        });
    }

    return _Response;
    
})(Response||{});