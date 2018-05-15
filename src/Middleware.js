/**
* Middleware Class
* @namespace
*/
var Middleware = (function (_Middleware) {
  
    /**
     * Authorization
     */
    _Middleware.authorize = function (req, res, next) {
      var apiKey = req.body.apiKey || req.params.apiKey;
      if(Config.get('apiKey') !== apiKey) {
        return res.json(AppError.error('http/403', 'Unauthorized!', 403));
      }
      return next();
    }
  
    /**
     * Confirm user token
     */
    _Middleware.confirmUser = function (req, res, next) {
      var uid = User.verify(req.body.token || req.params.token);
      if(!uid) return res.json(AppError.client(
        'auth/invalid-token',
        'Invalid token!'  
      ));
      return next({uid: uid});
    }
  
    return _Middleware;
  
  })(Middleware||{});