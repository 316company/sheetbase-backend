Router.get('/auth/action', function (params, body) {
    return Response.html(
        '<h1>Auth actions</h1>'+
        '<p>Password reset, ...</p>'
    );
});

Router.post('/auth/verify-code', function (params, body) {
    return Response.standard(
        User.verifyOobCode(body.oobCode)
    );
});

Router.post('/auth/reset-password', function (params, body) {
    return Response.standard(
        User.sendPasswordResetEmail(body.email)
    );
});

Router.post('/auth/set-password', function (params, body) {
    return Response.standard(
        User.doPasswordReset(body.oobCode, body.password)
    );
});