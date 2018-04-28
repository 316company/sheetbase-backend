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
                    return Response.json(AppError.make(
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
            
            /**
             * POST /file
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
            case 'file':
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