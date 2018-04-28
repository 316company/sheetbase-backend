/**
 * AppError Class
 * @namespace
 */
var AppError = (function (_AppError) {

    _AppError.make = function (code, message) {
        var err = {
            error: true
        };
        if(code) err.code = code;
        if(message) err.message = message;
        return err;
    }

    return _AppError;

})(AppError||{});