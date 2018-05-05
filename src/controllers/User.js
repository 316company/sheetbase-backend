/**
* User Class
* @namespace
*/
var User = (function (_User) {

  /**
   * Create new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @return {AuthUserAndToken|AppError}
   */
  _User.create = function (email, password) {
    var CONFIG = Config.get();      

    if(!email || !password) return AppError.client(
      'auth/missing-credential',
      'Missing email or password!'
    );
    if(!(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).test(email)) return AppError.client(
      'auth/invalid-email',
      'Invalid email format!'
    );    
    if((''+ password).length < 7) return AppError.client(
      'auth/invalid',
      'Password must greater than 7 characters!'
    );
    
    var UserTable = Model.get('User');
    
    // check exists
    var user = UserTable.where({ email: email }).first();
    if(user) return AppError.client(
      'auth/user-exists',
      'User exists!'
    );
    
    var passwordHash = Jsrsasign.KJUR.crypto.Util.sha256(''+ password);
    var timestampISO = (new Date()).toISOString();
    var userData = {
      'email': email,
      '_password': passwordHash,
      'uid': Helper.uid(),
      'timestamp': timestampISO,
      'lastLogin': timestampISO
    };
    
    // append data
    var userCreated = UserTable.create(userData);
    if(!userCreated) return AppError.server(
      'auth/action-fails',
      'Can not create user, please try again!'
    );
    
    // remove private fields
    for(var key in userData) {
      if(key.substr(0,1)==='_') delete userData[key];
    }
    
    // create token
    var payload = {
      uid: userData.uid
    };
    var token = Jsrsasign.KJUR.jws.JWS.sign(null, {alg: "HS256", typ: "JWT"}, payload, {"utf8": CONFIG.encryptionKey});    
    return { token: token, user: userData };
  }
  
  /**
   * Log user in
   * @param {string} email - User email
   * @param {string} password - User password
   * @return {AuthUserAndToken|AppError}
   */
  _User.login = function (email, password) {
    var CONFIG = Config.get();

    if(!email || !password) return AppError.client(
      'auth/missing-credential',
      'Missing email or password.'
    );

    var UserTable = Model.get('User');
    
    // check exists
    var user = UserTable.where({ email: email }).first();
    if(!user) return AppError.client(
      'auth/user-not-exists',
      'User doesn\'t exists!'
    );
    
    var passwordHash = Jsrsasign.KJUR.crypto.Util.sha256(''+ password);
    if(user._password !== passwordHash) return AppError.client(
      'auth/wrong-password',
      'Wrong password!'
    );
    
    // update login
    user['lastLogin'] = (new Date()).toISOString();
    user.save();

    var userData = user;

    // remove private fields
    for(var key in userData) {
      if(key.substr(0,1)==='_') delete userData[key];
    }
    
    // create token
    var payload = {
      uid: userData.uid
    };
    var token = Jsrsasign.KJUR.jws.JWS.sign(null, {alg: "HS256", typ: "JWT"}, payload, {"utf8": CONFIG.encryptionKey});
    return { token: token, user: Data.finalize(userData) };
  }

  /**
   * verify user token
   * @param {string} token - User token
   * @return {string}
   */
  _User.verify = function (token) {
    var CONFIG = Config.get();
    var isValid = Jsrsasign.KJUR.jws.JWS.verify(token||'', {"utf8": CONFIG.encryptionKey}, ['HS256']);
    if(!isValid) return false;
    var decodedData = Jsrsasign.KJUR.jws.JWS.parse(token);
    return decodedData.payloadObj.uid; 
  }

  /**
   * get user profile
   * @param {string} uid - User uid
   * @return {AuthUser|AppError}
   */
  _User.profile = function (uid) {
    if(!uid) return AppError.client(
      'auth/missing-info',
      'Missing information!'
    );

    var UserTable = Model.get('User');
    
    var user = UserTable.where({ uid: uid }).first();
    if(!user) return AppError.client(
      'auth/user-not-exists',
      'User doesn\'t exists!'
    );

    var userData = user;

    // remove private fields
    for(var key in userData) {
      if(key.substr(0,1)==='_') delete userData[key];
    }

    return Data.finalize(user);
  }

  /**
   * update user profile
   * @param {string} uid - User uid
   * @param {object} profileData - Data to be updated
   * @return {AuthUser|AppError}
   */
  _User.updateProfile = function (uid, profileData) {
    if(!uid || !profileData) return AppError.client(
      'auth/missing-info',
      'Missing information!'
    );
    if(!(profileData instanceof Object)) return AppError.client(
      'auth/invalid-data',
      'Profile data must be an object!'
    );

    var UserTable = Model.get('User');
    
    var user = UserTable.where({ uid: uid }).first();
    if(!user) return AppError.client(
      'auth/user-not-exists',
      'User doesn\'t exists!'
    );

    // remove dedicated fields
    delete profileData['#'];
    delete profileData.uid;
    delete profileData.timestamp;
    delete profileData.email;
    delete profileData._password;
    delete profileData.lastLogin;
    delete profileData._oobCode;
    delete profileData._oobTimestamp;
    delete profileData.providerData;

    // save data
    for(var key in profileData) {
      if(profileData[key] instanceof Object) {
        user[key] = JSON.stringify(profileData[key]);
      } else {
        user[key] = profileData[key];
      }
    }

    var userSaved = user.save();
    if(!userSaved) return AppError.server(
      'auth/action-fails',
      'Can not create user, please try again!'
    );

    var userData = user;

    // remove private fields
    for(var key in userData) {
      if(key.substr(0,1)==='_') delete userData[key];
    }

    return Data.finalize(user);
  }

  /**
   * verify OOB code
   * @param {string} oobCode - OOB code
   * @return {Success}
   */
  _User.verifyOobCode = function (oobCode) {
    if(!oobCode) return AppError.client(
      'auth/missing-info',
      'Missing information!'
    );

    var UserTable = Model.get('User');
    
    var user = UserTable.where({ _oobCode: oobCode }).first();
    if(!user) return AppError.client(
      'auth/code-invalid',
      'Invalid code!'
    );

    var codeExpired = true;
    if(user._oobTimestamp) {
      var timeThen = new Date(user._oobTimestamp);
      var timeNow = new Date();
      codeExpired = Math.floor((timeNow-timeThen)/86400000) > 0; // > 24 hours
    }
    if(codeExpired) return AppError.client(
      'auth/code-expired',
      'Code has been expired!'
    );

    return {
      code: oobCode
    };
  }

  /**
   * Send password reseting email
   * @param {string} email - User email
   * @return {Success}
   */
  _User.sendPasswordResetEmail = function (email) {
    if(!email) return AppError.client(
      'auth/missing-info',
      'Missing information!'
    );

    var UserTable = Model.get('User');
    
    var user = UserTable.where({ email: email }).first();
    if(!user) return AppError.client(
      'auth/user-not-exists',
      'User doesn\'t exists!'
    );
    
    user['_oobCode'] = Utilities.getUuid();
    user['_oobTimestamp'] = (new Date()).toISOString();
    user.save();

    // send email
    var recipient = user.email;
    var template = TemplateAuth.passwordReset(user);
    var title = template.title;
    var bodyText = template.text;
    var bodyHtml = template.html;

    var options = {
      name: Config.get('siteName') || 'Sheetbase App',
      htmlBody: bodyHtml
    };

    try {
      GmailApp.sendEmail(recipient, title, bodyText, options);
    } catch(error) {
      return AppError.server(
        'auth/email-not-sent',
        'Email not sent!'
      );
    }

    return {
      email: email
    };
  }

  /**
   * do action of resetting password
   * @param {string} uid - User uid
   * @param {string} newPassword - New password
   * @return {Success}
   */
  _User.doPasswordReset = function (oobCode, newPassword) {
    if(!oobCode || !newPassword) return AppError.client(
      'auth/missing-info',
      'Missing information!'
    );

    if((''+ newPassword).length < 7) return AppError.client(
      'auth/invalid',
      'Password must greater than 7 characters!'
    );
    
    var UserTable = Model.get('User');
    
    var user = UserTable.where({ _oobCode: oobCode }).first();
    if(!user) return AppError.client(
      'auth/code-invalid',
      'Invalid code!'
    );

    var codeExpired = true;
    if(user._oobTimestamp) {
      var timeThen = new Date(user._oobTimestamp);
      var timeNow = new Date();
      codeExpired = Math.floor((timeNow-timeThen)/86400000) > 0; // > 24 hours
    }
    if(codeExpired) return AppError.client(
      'auth/code-expired',
      'Code has been expired!'
    );
    
      // update password
    user['_password'] = Jsrsasign.KJUR.crypto.Util.sha256(''+ newPassword);
    if(!user.save()) return AppError.server(
      'auth/action-fails',
      'Can not update user password, please try again!'
    );
    
    // reset oob data
    user['_oobCode'] = '';
    user['_oobTimestamp'] = '';
    user.save();

    return {
      code: oobCode
    };
  }

  return _User;

})(User||{});