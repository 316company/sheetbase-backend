/**
 * App Class
 * A proxy class
 */
var App = (function (_App) {

    // Router
    _App.use = function () { return Router.use.apply(Router, arguments); }
    _App.all = function () { return Router.all.apply(Router, arguments); }
    _App.get = function () { return Router.get.apply(Router, arguments); }
    _App.post = function () { return Router.post.apply(Router, arguments); }

    // Config
    _App.set = function (key, value) { return Config.set(key, value); }

    return _App;

})(App||{});