/**
 * GETRoute Class
 * @namespace
 */
var GETRoute = (function (_GETRoute) {

    /**
     * default GET routes
     * @param {object} e - HTTP event
     */
    _GETRoute.defaults = function (e) {
        var _this = this;
        
        var params = Request.param(e)||{};
        var body = Request.body(e);

        var endpoint = params.e||''; endpoint = (endpoint.substr(0,1)==='/') ? endpoint: '/'+ endpoint;
        switch(endpoint) {

            case '/data':
                return Response.json(
                    Data.get(params.table, params.range)
                );
            break;
        
            case '/user/profile':
                var uid = User.verify(params.token);
                if(!uid)
                    return Response.json(AppError.make(
                        'auth/invalid-token',
                        'Invalid token!'  
                    ));
                return Response.json(User.profile(uid));
            break;
        
            case '/auth/action':
                return Response.html(
                    '<h1>Auth actions</h1>'+
                    '<p>Password reset, ...</p>'
                );
            break;

            case '/file':
                return Response.json(
                    AppFile.get(params.id)
                );
            break;
              
            default:
              return Response.home();
            break;              
        }
    }

    return _GETRoute;

})(GETRoute||{});