Router.get('/auth/action', Middleware.authorize, function (req, res) {
    return res.html(
        '<h1>Auth actions</h1>'+
        '<p>Password reset, ...</p>'
    );
});

Router.post('/auth/verify-code', Middleware.authorize, function (req, res) {
    return res.standard(
        User.verifyOobCode(req.body.code)
    );
});

Router.post('/auth/reset-password', Middleware.authorize, function (req, res) {
    return res.standard(
        User.sendPasswordResetEmail(req.body.email)
    );
});

Router.post('/auth/set-password', Middleware.authorize, function (req, res) {
    return res.standard(
        User.doPasswordReset(req.body.code, req.body.password)
    );
});