/**
* User Class
* @namespace
*/
var User = (function (__this) {

  /**
   * Create new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @return {AuthUserAndToken|XError}
   */
  __this.create = function (email, password) {
    var CONFIG = Config.get();      

    if(!email || !password)
      return XError.make(
        'auth/missing-credential',
        'Missing email or password!'
      );    
    if(!(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).test(email))
      return XError.make(
        'auth/invalid-email',
        'Invalid email format!'
      );    
    if((''+ password).length < 7)
      return XError.make(
        'auth/invalid',
        'Password must greater than 7 characters!'
      );
    
    var UserTable = Model.get('User');
    
    // check exists
    var user = UserTable.where({ email: email }).first();
    if(user)
      return XError.make(
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
    if(!userCreated)
      return XError.make(
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
   * @return {AuthUserAndToken|XError}
   */
  __this.login = function (email, password) {
    var CONFIG = Config.get();

    if(!email || !password)
      return XError.make(
        'auth/missing-credential',
        'Missing email or password.'
      );

    var UserTable = Model.get('User');
    
    // check exists
    var user = UserTable.where({ email: email }).first();
    if(!user)
      return XError.make(
        'auth/user-not-exists',
        'User doesn\'t exists!'
      );
    
    var passwordHash = Jsrsasign.KJUR.crypto.Util.sha256(''+ password);
    if(user._password !== passwordHash)
      return XError.make(
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
  __this.verify = function (token) {
    var CONFIG = Config.get();
    var isValid = Jsrsasign.KJUR.jws.JWS.verify(token||'', {"utf8": CONFIG.encryptionKey}, ['HS256']);
    if(!isValid) return false;
    var decodedData = Jsrsasign.KJUR.jws.JWS.parse(token);
    return decodedData.payloadObj.uid; 
  }

  /**
   * get user profile
   * @param {string} uid - User uid
   * @return {AuthUser|XError}
   */
  __this.profile = function (uid) {
    if(!uid)
      return XError.make(
        'auth/missing-info',
        'Missing information!'
      );

    var UserTable = Model.get('User');
    
    var user = UserTable.where({ uid: uid }).first();
    if(!user)
      return XError.make(
        'auth/user-not-exists',
        'User doesn\'t exists!'
      );

    var userData = user;

    // remove private fields
    for(var key in userData) {
      if(key.substr(0,1)==='_') delete userData[key];
    }

    return {
      user: Data.finalize(user)
    }
  }

  /**
   * update user profile
   * @param {string} uid - User uid
   * @param {object} profileData - Data to be updated
   * @return {AuthUser|XError}
   */
  __this.updateProfile = function (uid, profileData) {
    if(!uid || !profileData)
      return XError.make(
        'auth/missing-info',
        'Missing information!'
      );
    if(!(profileData instanceof Object))
      return XError.make(
        'auth/invalid-data',
        'Profile data must be an object!'
      );

    var UserTable = Model.get('User');
    
    var user = UserTable.where({ uid: uid }).first();
    if(!user)
      return XError.make(
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
    if(!userSaved)
      return XError.make(
        'auth/action-fails',
        'Can not create user, please try again!'
      );

    var userData = user;

    // remove private fields
    for(var key in userData) {
      if(key.substr(0,1)==='_') delete userData[key];
    }

    return {
      user: Data.finalize(user)
    }
  }

  /**
   * verify OOB code
   * @param {string} oobCode - OOB code
   * @return {Success}
   */
  __this.verifyOobCode = function (oobCode) {
    if(!oobCode)
      return XError.make(
        'auth/missing-info',
        'Missing information!'
      );

    var UserTable = Model.get('User');
    
    var user = UserTable.where({ _oobCode: oobCode }).first();
    if(!user)
      return XError.make(
        'auth/user-not-exists',
        'User doesn\'t exists!'
      );

    return {
      uid: uid,
      success: true
    }
  }

  /**
   * Send password reseting email
   * @param {string} email - User email
   * @return {Success}
   */
  __this.sendPasswordResetEmail = function (email) {
    if(!email)
      return XError.make(
        'auth/missing-info',
        'Missing information!'
      );

    var UserTable = Model.get('User');
    
    var user = UserTable.where({ email: email }).first();
    if(!user)
      return XError.make(
        'auth/user-not-exists',
        'User doesn\'t exists!'
      );
    
    user['_oobCode'] = Helper.guid();
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
      return XError.make(
        'mail/not-sent',
        'Email not sent!'
      );
    }

    return {
      email: email,
      success: true
    };
  }

  /**
   * do action of resetting password
   * @param {string} uid - User uid
   * @param {string} newPassword - New password
   * @return {Success}
   */
  __this.doPasswordReset = function (oobCode, newPassword) {
    if(!oobCode || !newPassword)
      return XError.make(
        'auth/missing-info',
        'Missing information!'
      );

    if((''+ newPassword).length < 7)
      return XError.make(
        'auth/invalid',
        'Password must greater than 7 characters!'
      );
    
    var UserTable = Model.get('User');
    
    var user = UserTable.where({ _oobCode: oobCode }).first();
    if(!user)
      return XError.make(
        'auth/user-not-exists',
        'User doesn\'t exists!'
      );
    
    user['_oobCode'] = '';
    user['_password'] = Jsrsasign.KJUR.crypto.Util.sha256(''+ newPassword);
    
    var userSaved = user.save();
    if(!userSaved)
      return XError.make(
        'auth/action-fails',
        'Can not update user, please try again!'
      );

    return {
      uid: uid,
      success: true
    };
  }

  return __this;

})(User||{});