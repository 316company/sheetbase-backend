Router.get('/data', Request.authorize, function (req, res) {
    return res.standard(
        Data.get(req.params.table, req.params.range)
    );
});