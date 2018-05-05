Router.get('/auth/action', Request.authorize, function (req, res) {
    return res.html(
        '<h1>Auth actions</h1>'+
        '<p>Password reset, ...</p>'
    );
});

Router.post('/auth/verify-code', Request.authorize, function (req, res) {
    return res.standard(
        User.verifyOobCode(req.body.code)
    );
});

Router.post('/auth/reset-password', Request.authorize, function (req, res) {
    return res.standard(
        User.sendPasswordResetEmail(req.body.email)
    );
});

Router.post('/auth/set-password', Request.authorize, function (req, res) {
    return res.standard(
        User.doPasswordReset(req.body.code, req.body.password)
    );
});