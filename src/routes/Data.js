Router.get('/data', Middleware.authorize, function (req, res) {
    return res.standard(
        req.params.list ? Data.list(req.params.list): Data.get(req.params.object || req.params.path)
    );
});

Router.post('/data', Middleware.authorize, function (req, res) {
    return res.standard(
        Data.update(req.body.updates)
    );
});