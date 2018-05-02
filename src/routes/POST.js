/**
 * POSTRoute Class
 * @namespace
 */
var POSTRoute = (function (_POSTRoute) {
 
    /**
     * default POST routes
     * @param {object} e - HTTP event
     */
    _POSTRoute.defaults = function (e) {
        var _this = this;

        var params = Request.param(e)||{};
        var body = Request.body(e);

        var endpoint = params.e||''; endpoint = (endpoint.substr(0,1)==='/') ? endpoint: '/'+ endpoint;
        switch(endpoint) {

            case '/user/create':
                var credential = body.credential || {};
                return Response.json(
                    User.create(
                        credential.email,
                        credential.password
                    )
                );
            break;
            
            case '/user/login':
                var credential = body.credential || {};
                return Response.json(
                    User.login(
                        credential.email,
                        credential.password
                    )
                );
            break;

            case '/user/profile':
                var uid = User.verify(body.token);
                if(!uid)
                    return Response.json(AppError.make(
                        'auth/invalid-token',
                        'Invalid token!'  
                    ));
                return Response.json(
                    User.updateProfile(uid, body.profileData)
                );
            break;

            case '/auth/verify-code':
                return Response.json(
                    User.verifyOobCode(body.oobCode)
                );
            break;

            case '/auth/password-reset':
                return Response.json(
                    User.sendPasswordResetEmail(body.email)
                );
            break;

            case '/auth/set-password':
                return Response.json(
                    User.doPasswordReset(body.oobCode, body.password)
                );
            break;
            
            /**
             * Upload a file
             * @param file: {
             *  name: string,
             *  mimeType: string,
             *  base64String: string          
             * }
             * @param folder: string
             * 
             * @return {FileData|AppError}
             *
             */
            case '/file':
                return Response.json(
                    AppFile.set(body.file, body.folder)
                );
            break;

            default:
              return Response.home();
            break;
        }

    }


    return _POSTRoute;

})(POSTRoute||{});