Router.get('/file', Middleware.authorize, function (req, res) {
    return res.standard(
        AppFile.get(req.params.id)
    );
});

Router.post('/file', Middleware.authorize, function (req, res) {
    return res.standard(
        AppFile.set(req.body.file, req.body.folder, req.body.name)
    );
});