Router.get('/data', function (params, body) {
    return Response.standard(
        Data.get(params.table, params.range)
    );
});