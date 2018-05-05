var Router = (function (_Router) {
    
    _Router.routes_ = {};
    _Router.globalMiddlewares_ = [];
    _Router.routeMiddlewares_ = {};
    
    _Router.use = function() {
        var _this = this;
        var args = Array.prototype.slice.call(arguments, 0);

        if(args.length < 1) return;

        // TODO: validate arguments

        // global middlewares
        if(args[0] instanceof Function) {
            _this.globalMiddlewares_ = _this.globalMiddlewares_.concat(args);
        }
        // route specific middlewares
        else {
            var routeName = args.shift();
            _this.routeMiddlewares_['GET:'+ routeName] = (_this.routeMiddlewares_['GET:'+ routeName]||[]).concat(args);
            _this.routeMiddlewares_['POST:'+ routeName] = (_this.routeMiddlewares_['POST:'+ routeName]||[]).concat(args);
        }

    }

    _Router.get = function () {
        var _this = this;
        var args = Array.prototype.slice.call(arguments, 0);

        // TODO: validata route name and handler

        var routeName = args.shift();
        var handler = args.pop();

        _this.routes_['GET:'+ routeName] = handler;
        _this.routeMiddlewares_['GET:'+ routeName] = args;
    }

    _Router.post = function () {
        var _this = this;
        var args = Array.prototype.slice.call(arguments, 0);

        // TODO: validata route name and handler

        var routeName = args.shift();
        var handler = args.pop();

        _this.routes_['POST:'+ routeName] = handler;
        _this.routeMiddlewares_['POST:'+ routeName] = args;
    }

    _Router.get_ = function(name) {
        var _this = this;

        var handler = _this.routes_['GET:'+ name] || function(req, res) {
            return res.html('<h1>Not found!</h1>');
        };
        var handlers = _this.routeMiddlewares_['GET:'+ name] || [];
        // add global middlewares
        handlers = _this.globalMiddlewares_.concat(handlers);
        // add main handler
        handlers.push(handler);

        return handlers;
    }
    _Router.post_ = function(name) {
        var _this = this;

        var handler = _this.routes_['POST:'+ name] || function(req, res) {
            return res.json(AppError.error('http/404', 'Not found!', 404));
        };
        var handlers = _this.routeMiddlewares_['POST:'+ name] || [];
        // add global middlewares
        handlers = _this.globalMiddlewares_.concat(handlers);
        // add main handler
        handlers.push(handler);

        return handlers;
    }

    return _Router;

})(Router||{});