var User = {

  /**
   * Create new user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  create: function (email, password) {
    var UserTable = Model.get('User');
    var CONFIG = Config.get();    

    if(!UserTable) return {
      error: true,
      message: 'No model User found!'
    };

    if(!email || !password) return {
      error: true,
      message: 'Missing email or password'
    };
    
    if(!(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i).test(email)) return {
      error: true,
      message: 'Invalid email format!'
    };
    
    if((''+ password).length < 7) return {
      error: true,
      message: 'Password must greater than 7 characters!'
    };
    
    // check exists
    var user = UserTable.where({ email: email }).first();
    if(user) return {
      error: true,
      message: 'User exists!'
    };
    
    var passwordHash = KJUR.crypto.Util.sha256(''+ password);
    var timestampISO = (new Date()).toISOString();
    var userData = {
      'email': email,
      'password': passwordHash,
      'uid': Helper.uid(),
      'timestamp': timestampISO,
      'lastLogin': timestampISO
    };
    
    // append data
    var userCreated = UserTable.create(userData);
    
    if(!userCreated) return {
      error: true,
      message: 'Can not create user, please try again!'
    };
    
    // remove password hash
    delete userData.password;
    
    // create token
    var payload = {
      uid: userData.uid
    };
    var token = KJUR.jws.JWS.sign(null, {alg: "HS256", typ: "JWT"}, payload, {"utf8": CONFIG.encryptionKey});    
    return { token: token, user: userData };
  },
  


  /**
   * Log user in
   * @param {string} email - User email
   * @param {string} password - User password
   */
  login: function (email, password) {
    var UserTable = Model.get('User');
    var CONFIG = Config.get();



    if(!UserTable) return {
      error: true,
      message: 'No model User found!'
    };

    if(!email || !password) return {
      error: true,
      message: 'Missing email or password'
    };
    
    // check exists
    var user = UserTable.where({ email: email }).first();
    if(!user) return {
      error: true,
      message: 'User doesnt exists!'
    };
    
    var passwordHash = KJUR.crypto.Util.sha256(''+ password);
    
    if(user.password !== passwordHash) return {
      error: true,
      message: 'Wrong password!'
    };
    
    // update login
    var timestampISO = (new Date()).toISOString();
    user['lastLogin'] = timestampISO;
    user.save();
    
    
    // create token
    var payload = {
      uid: user.uid
    };
    var token = KJUR.jws.JWS.sign(null, {alg: "HS256", typ: "JWT"}, payload, {"utf8": CONFIG.encryptionKey});
    return { token: token, user: Helper.modifyValue(user) };
  },


  /**
   * update user profile
   */
  profile: function (uid, profileData) {
    if(!profileData) return {
      error: true,
      code: 'auth/missing-info',
      message: 'Missing information!'
    };

    if(!(profileData instanceof Object)) return {
      error: true,
      code: 'auth/wrong-info',
      message: 'Profile data must be an object!'
    };

    // TODO: validate data

    var _this = this;
    var UserTable = Model.get('User');
    
    var user = UserTable.where({ uid: uid }).first();

    if(!user) return {
      error: true,
      code: 'auth/user-not-exist',
      message: 'User doesnt exist!'
    };

    // remove dedicated fields
    delete profileData['#'];
    delete profileData.uid;
    delete profileData.timestamp;
    delete profileData.email;
    delete profileData.password;
    delete profileData.token;
    delete profileData.lastLogin;
    delete profileData.oobCode;
    delete profileData.providerData;

    // save data
    for(var key in profileData) {
      if(profileData[key] instanceof Object) {
        user[key] = JSON.stringify(profileData[key]);
      } else {
        user[key] = profileData[key];
      }
    }

    var savedUser = user.save();
    if(!savedUser) return {
      error: true,
      code: 'auth/update-profile-fails',
      message: 'Update profile fails!'
    };

    return {
      user: Helper.modifyValue(user)
    }
  },


  /**
   * verify user token
   */
  verify: function (token) {
    var CONFIG = Config.get();
    var isValid = KJUR.jws.JWS.verify(token, {"utf8": CONFIG.encryptionKey}, ['HS256']);
    if(!isValid) return false;
    var decodedData = KJUR.jws.JWS.parse(token);
    return decodedData.payloadObj.uid; 
  }
  

}