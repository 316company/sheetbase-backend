/**
* Response Class
* @namespace
*/
var Response = (function (_Response) {

    /**
     * Response content
     * @param {string} content - String content
     */
    _Response.send = function (content) {
        var _this = this;
        if(content instanceof Object) return _this.json(content); 
        return _this.html(content);
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
     * Response HTML with templating
     * @param {string} templateContent - HTML template
     * @param {object} data - HTML template
     * @return {HtmlServiceHTMLData}
     */
    _Response.render = function (template, data, viewEngine) {
        viewEngine = viewEngine || Config.get('view engine') || 'native';
        var htmlOutput;
        
        switch(viewEngine) {
            case 'handlebars':
                var templateText = template.getRawContent();
                var handlebars = Handlebars.Handlebars.compile(templateText);
                var html = handlebars(data);
                htmlOutput = HtmlService.createHtmlOutput(html);
            break;

            case 'ejs':
                var templateText = template.getRawContent();
                var html = Ejs.ejs.render(templateText, data);
                htmlOutput = HtmlService.createHtmlOutput(html);
            break;

            case 'native':
            default:
                template = Object.assign(template, data);
                htmlOutput = template.evaluate();
            break;
        }

        return htmlOutput;
    }


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
     * Standard JSON response
     * @param {data} object - Body of the response
     * @param {meta} object - Headers of the response
     * @return {StandardResponse}
     */
    _Response.standard = function (data, meta) {
        var _this = this;
        var responseData = data;
        if(!responseData) responseData = AppError.server();
        if(!(responseData instanceof Object)) responseData = {value: responseData};
        if(!responseData.error) {
            responseData = {
                success: true,
                status: 200,
                data: responseData
            };
            meta = meta || {};
            if(!(meta instanceof Object)) meta = {value: meta};
            meta.timestamp = (new Date()).toISOString();
            responseData.meta = meta;
        }
        return _this.json(responseData);
    }

    return _Response;
    
})(Response||{});