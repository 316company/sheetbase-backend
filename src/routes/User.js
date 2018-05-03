Router.get('/user/profile', function (params, body) {
    var uid = User.verify(params.token);
    if(!uid) return Response.json(AppError.client(
        'auth/invalid-token',
        'Invalid token!'  
    ));
    return Response.standard(
        User.profile(uid)
    );
});

Router.post('/user/create', function (params, body) {
    var credential = body.credential || {};
    return Response.standard(
        User.create(
            credential.email,
            credential.password
        )
    );
});

Router.post('/user/login', function (params, body) {
    var credential = body.credential || {};
    return Response.standard(
        User.login(
            credential.email,
            credential.password
        )
    );
});

Router.post('/user/profile', function (params, body) {
    var uid = User.verify(body.token);
    if(!uid) return Response.json(AppError.client(
        'auth/invalid-token',
        'Invalid token!'  
    ));
    return Response.standard(
        User.updateProfile(uid, body.profileData)
    );
});