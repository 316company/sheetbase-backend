Router.get('/file', function (params, body) {
    return Response.standard(
        AppFile.get(params.id)
    );
});

Router.post('/file', function (params, body) {
    return Response.standard(
        AppFile.set(body.file, body.folder)
    );
});