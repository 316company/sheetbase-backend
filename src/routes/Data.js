Router.get('/data', Middleware.authorize, function (req, res) {
    return res.standard(
        Data.get(req.params.table, req.params.range)
    );
});

Router.post('/data', Middleware.authorize, function (req, res) {
    return res.standard(
        Data.update(req.body.table, req.body.data)
    );
});