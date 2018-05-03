/**
 * AppError Class
 * @namespace
 */
var AppError = (function (_AppError) {

    _AppError.client = function (code, message, data) {
        var _this = this;
        return _this.error(code, message, 400, data);
    }

    _AppError.server = function (code, message, data) {
        var _this = this;
        return _this.error(code, message, 500, data);
    }

    _AppError.error = function (code, message, httpCode, data) {
        var errorData = {
            error: true,
            status: httpCode || 400,
            meta: {
                timestamp: (new Date()).toISOString()
            }
        };
        errorData.meta.code = code || 'app/unknown';
        errorData.meta.message = message || 'Something wrong!';
        if(data) errorData.data = data;
        return errorData;
    }

    return _AppError;

})(AppError||{});