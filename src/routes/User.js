Router.get('/user/profile', Request.authorize, function (req, res) {
    var uid = User.verify(req.params.token);
    if(!uid) return res.json(AppError.client(
        'auth/invalid-token',
        'Invalid token!'  
    ));
    return res.standard(
        User.profile(uid)
    );
});

Router.post('/user/create', Request.authorize, function (req, res) {
    var credential = req.body.credential || {};
    return res.standard(
        User.create(
            credential.email,
            credential.password
        )
    );
});

Router.post('/user/login', Request.authorize, function (req, res) {
    var credential = req.body.credential || {};
    return res.standard(
        User.login(
            credential.email,
            credential.password
        )
    );
});

Router.post('/user/profile', Request.authorize, Request.confirmUser, function (req, res) {
    return res.standard(
        User.updateProfile(req.data.uid, req.body.profile)
    );
});