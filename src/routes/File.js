Router.get('/file', Request.authorize, function (req, res) {
    return res.standard(
        AppFile.get(req.params.id)
    );
});

Router.post('/file', Request.authorize, function (req, res) {
    return res.standard(
        AppFile.set(req.body.file, req.body.folder)
    );
});