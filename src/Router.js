var Router = (function (_Router) {

    _Router.GETRoutes_ = {};
    _Router.POSTRoutes_ = {};

    _Router.get = function (name, handler) {
        var _this = this;
        _this.GETRoutes_[name] = handler;
    }
    _Router.post = function (name, handler) {
        var _this = this;
        _this.POSTRoutes_[name] = handler;
    }

    _Router.get_ = function(name) {
        var _this = this;
        return  _this.GETRoutes_[name];
    }
    _Router.post_ = function(name) {
        var _this = this;
        return  _this.POSTRoutes_[name];
    }

    return _Router;

})(Router||{});