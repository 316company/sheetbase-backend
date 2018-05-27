Router.get('/user/profile', Middleware.authorize, function (req, res) {
    var uid = User.verify(req.params.token);
    if(!uid) return res.json(AppError.client(
        'auth/invalid-token',
        'Invalid token!'  
    ));
    return res.standard(
        User.profile(uid)
    );
});

Router.post('/user/create', Middleware.authorize, function (req, res) {
    var credential = req.body.credential || {};
    return res.standard(
        User.create(
            credential.email,
            credential.password
        )
    );
});

Router.post('/user/login', Middleware.authorize, function (req, res) {
    var credential = req.body.credential || {};
    return res.standard(
        User.login(
            credential.email,
            credential.password
        )
    );
});

Router.post('/user/profile', Middleware.authorize, Middleware.confirmUser, function (req, res) {
    return res.standard(
        User.updateProfile(req.data.uid, req.body.profile)
    );
});