var HTTP = (function (_HTTP) {

    _HTTP.get = function (e, authCheck) {
        var params = Request.param(e)||{};
        var body = Request.body(e);
        var endpoint = params.e||'';
        if(endpoint.substr(0,1)!=='/') endpoint = '/'+ endpoint;

        if(authCheck && !Request.isAuthorized(e)) {
            return Response.json(AppError.error('http/403', 'Unauthorized!', 403));
        }

        var routeHandler = Router.get_(endpoint);
        if(!routeHandler) routeHandler = function(p, b) {
            return Response.html('<h1>Not found!</h1>');
        }
        return routeHandler(params, body);
    }

    _HTTP.post = function (e, authCheck) {
        var params = Request.param(e)||{};
        var body = Request.body(e);
        var endpoint = params.e||'';
        if(endpoint.substr(0,1)!=='/') endpoint = '/'+ endpoint;

        if(authCheck && !Request.isAuthorized(e)) {
            return Response.json(AppError.error('http/403', 'Unauthorized!', 403));
        }

        var routeHandler = Router.post_(endpoint);
        if(!routeHandler) routeHandler = function(p, b) {
            return Response.json(AppError.error('http/404', 'Not found!', 404));
        }
        return routeHandler(params, body);
    }

    return _HTTP;

})(HTTP||{});