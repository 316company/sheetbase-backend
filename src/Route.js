/**
 * Route Class
 * @namespace
 */
var Route = (function (__this) {

    /**
     * default GET routes
     * @param {object} e - HTTP event
     */
    __this.GETRoutes = function (e) {
        var params = Request.param(e)||{};
        var body = Request.body(e);

        switch(params.e) {

            case 'data':
                return Response.json(
                    Data.get(params.table, params.range)
                );
            break;
        
            case 'user/profile':
                var uid = User.verify(params.token);
                if(!uid)
                    return Response.json(XError.make(
                        'auth/invalid-token',
                        'Invalid token!'  
                    ));
                return Response.json(User.profile(uid));
            break;
        
            case 'auth/action':
                return Response.html(
                    '<h1>Auth actions</h1>'+
                    '<p>Password reset, ...</p>'
                );
            break;
              
            default:
              return Response.home();
            break;              
        }
    }
 
    /**
     * default POST routes
     * @param {object} e - HTTP event
     */
    __this.POSTRoutes = function (e) {
        var params = Request.param(e)||{};
        var body = Request.body(e);

        switch(params.e) {

            case 'user/create':
                var credential = body.credential || {};
                return Response.json(
                    User.create(
                        credential.email,
                        credential.password
                    )
                );
            break;
            
            case 'user/login':
                var credential = body.credential || {};
                return Response.json(
                    User.login(
                        credential.email,
                        credential.password
                    )
                );
            break;

            case 'user/profile':
                var uid = User.verify(body.token);
                if(!uid)
                    return Response.json(XError.make(
                        'auth/invalid-token',
                        'Invalid token!'  
                    ));
                return Response.json(
                    User.updateProfile(uid, body.profileData)
                );
            break;

            case 'auth/verifyCode':
                return Response.json(
                    User.verifyOobCode(body.oobCode)
                );
            break;

            case 'auth/passwordReset':
                return Response.json(
                    User.sendPasswordResetEmail(body.email)
                );
            break;

            case 'auth/setPassword':
                return Response.json(
                    User.doPasswordReset(body.oobCode, body.password)
                );
            break;

            default:
              return Response.home();
            break;
        }

    }


    return __this;

})(Route||{});