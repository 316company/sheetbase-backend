var HTTP = (function (_HTTP) {

    _HTTP.get = function (e) {
        var _this = this;
        
        var endpoint = (e.parameter||{}).e||'';
        if(endpoint.substr(0,1)!=='/') endpoint = '/'+ endpoint;

        var req = {
            params: e.parameter||{},
            body: JSON.parse(e.postData ? e.postData.contents : '{}')
        };
        var res = Response;

        var handlers = Router.get_(endpoint);
        return _this.run_(handlers, req, res);
    }

    _HTTP.post = function (e) {
        var _this = this;
        
        var endpoint = (e.parameter||{}).e||'';
        if(endpoint.substr(0,1)!=='/') endpoint = '/'+ endpoint;

        var req = {
            params: e.parameter||{},
            body: JSON.parse(e.postData ? e.postData.contents : '{}')
        };
        var res = Response;

        var handlers = Router.post_(endpoint);
        return _this.run_(handlers, req, res);
    }

    _HTTP.run_ = function (handlers, req, res) {
        var _this = this;
        var handler = handlers.shift();
        if(handlers.length < 1) {
            return handler(req, res);
        } else {
            var next = function() {
                return _this.run_(handlers, req, res);
            }
            return handler(req, res, next);
        }
    }

    return _HTTP;

})(HTTP||{});