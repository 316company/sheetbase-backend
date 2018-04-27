/**
 * XError Class
 * @namespace
 */
var XError = (function (__this) {

    __this.make = function (code, message) {
        var err = {
            error: true
        };
        if(code) err.code = code;
        if(message) err.message = message;
        return err;
    }

    return __this;

})(XError||{});