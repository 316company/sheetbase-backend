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
    var seconds = (new Date().getTime()) / 1000;
    var payload = {
      "iss": 'contact@sheetbase.net',
      "sub": 'contact@sheetbase.net',
      "aud": "https://sheetbase.net/identity",
      "iat": seconds,
      "exp": seconds+(24*60*60),
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
    var seconds = (new Date().getTime()) / 1000;
    var payload = {
      "iss": 'contact@sheetbase.net',
      "sub": 'contact@sheetbase.net',
      "aud": "https://sheetbase.net/identity",
      "iat": seconds,
      "exp": seconds+(24*60*60),
      uid: user.uid
    };
    var token = KJUR.jws.JWS.sign(null, {alg: "HS256", typ: "JWT"}, payload, {"utf8": CONFIG.encryptionKey});
    return { token: token, user: user };
  }
  

}