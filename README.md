# Sheetbase Script Core

Core Module to build Sheetbase Backend. Homepage: https://sheetbase.net

## Install

Library ID: ``1ZUoDbpEwu4DC3i5tHsNMm3ng7smMWSsH4GzUvwCttlCHplOP2ly7Kzgw``

Select latest version, set Identifier to ``Sheetbase``.

## Usage

```javascript
// Step 1: register the http events
function doGet(e) { return Sheetbase.HTTP.get(e) }
function doPost(e) { return Sheetbase.HTTP.post(e) }

// Step 2: initialize the library
var app = Sheetbase.initialize({
    "apiKey": "<api_key>",
    "databaseId": "<database_id>",
    "encryptionKey": "<encryption_key>",
    "contentFolder": "<content_folder_id>",

    // other configs
    "authUrl": "https://domain.me/auth/action"
});

// Step 3: register routes
app.get('/', function (req, res) {
    return res.html('<h1>Hello world!</h1>'); // return some HTML
});
app.post('/', function (req, res) {
    return res.json({me: 'Hello world!'}); // return some JSON
});

// with middleware
app.post('/private', function (req, res, next) {
    if(req.body.apiKey !== 'my_api_key') return res.json(Sheetbase.AppError.error('403', 'Unauthorized', 403)); // exit
    return next(); // continue
}, function (req, res) {
    return res.standard({hooray: 'You have passed the security check!'});
});
// same as above
app.post('/private', Sheetbase.Request.authorize, function (req, res) {
    return res.standard({hooray: 'You have passed the security check!'});
});

// middleware data
app.post('/user', function (req, res, next) {
    var uid = Sheetbase.User.verify(req.body.token || req.params.token);
    if(!uid) return res.json(Sheetbase.AppError.client('auth/invalid-token', 'Invalid token!')); // exit
    return next({ uid: uid }); // continue, pass data to next handler
}, function (req, res) {
    var uid = req.data.uid; // get data from upper handler
    return res.standard({hooray: 'You have passed the security check!', uid: uid});
});
// same as above
app.post('/user', Sheetbase.Request.confirmUser, function (req, res) {
    var uid = req.data.uid;  // get data from upper handler
    return res.standard({hooray: 'You have passed the security check!', uid: uid});
});

```



## Config

| Key           | Type   | Description                         |
|---------------|--------|-------------------------------------|
| apiKey        | string | Backend API key                     |
| databaseId    | string | ID of the spreadsheet database      |
| encryptionKey | string | (optional) Backend encryption key   |
| contentFolder | string | (optional) Drive content folder     |
| authUrl       | string | (optional) Auth actions handler url |




## Router

Inspired by Express JS.

```javascript
    Sheetbase.Router.get('/', function (req, res, next) {
        // logic
    }, function (req, res) {
        // logic
    });
```

### req

Request object.

    {
        params: object,
        body: object,
        data: object
    }

```javascript
    var apiKey = req.params.apiKey;
    var apiKey = req.body.apiKey;
    var myData = req.data.myData;
```

### res

Response object. See ``API > Response`` below.

```javascript
    return res.json({...});
    return res.html('My HTML code');
    return res.html('MyHTML', true);
```

### next

Process to next middlewares.

```javascript
    return next(data);
```



## Default routes

These routes were exposed by defaults, you can overide them in your app if you wish, authorized by using ``apiKey``.

Response can be HTML page or JSON data of ``StandardError`` or ``StandardSuccess``.

All routes accept ``apiKey`` in params or body for authorization.

+ StandardError

```typescript
{
    error: boolean, // true
    status: number, // 400, 500, ...
    meta: {
        timestamp: string, // ISO date string
        code: tring,
        message: string,
        ...
    },
    data?: any // optional data
}
```

+ StandardSuccess

```typescript
{
    success: boolean, // true
    status: number, // 200
    meta: {
        timestamp: string, // ISO date string
        ...
    },
    data: any // response data
}
```



### User and authentication

+ GET ``/auth/action``

Handle user authentication actions: Reset password, .... This link will be sent to user email when asked, will be replaced by using ``authUrl``.

Params:

    ?mode=<mode>&oobCode=<action_code>

Body: n/a

Response: Action form to do whatever action described by ``mode`` param.

---

+ POST ``/auth/verify-code``

Verify action code.

Params: n/a

Body:

    {
        code: string
    }

Response data: 

    {
        code: string
    }

---

+ POST ``/auth/reset-password``

Ask for password reset email.

Params: n/a

Body:

    {
        email: string
    }

Response data:

    {
        email: string
    }

---

+ POST ``/auth/set-password``

Confirm new password.

Params: n/a

Body:

    {
        code: string,
        password: string
    }

Response data:

    {
        code: string
    }

---

+ POST ``/user/create``

Create new user.

Params: n/a

Body:

    {
        email: string,
        password: string
    }

Response data:

    UserProfile

---

+ POST ``/user/login``

Log user in.

Params: n/a

Body:

    {
        email: string,
        password: string
    }

Response data:

    UserProfile

---

+ GET ``/user/profile``

Get user profile.

Params:

    ?token=<user_id_token>

Body: n/a

Response data:

    UserProfile

---

+ POST ``/user/profile``

Update user profile.

Params: n/a

Body:

    {
        token: string,
        profile: object
    }

Response data:

    UserProfile



### Data

+ GET ``/data``

Get data.

Params:

    {
        table: string,
        range?: string
    }

Body: n/a

Response data:

    Data




### File

+ GET ``/file``

Get file infomation.

Params:

    ?id=<file_id>

Body: n/a

Response data:

    FileInfo

---

+ POST ``/file``

Upload a file.

Params: n/a

Body:

    {
        file: string,
        folder?: string
    }

Response data:

    FileInfo



## API

### initialize(config)

Init the library.

```javascript
    var app = Sheetbase.initialize(SHEETBASE_CONFIG);
```



### Config

+ get(key)

Get config by key

```javascript
    var databaseId = Sheetbase.Config.get('databaseId');
```



### AppError

+ error(code, message, httpStatus, data)

Build an error

```javascript
    var error = Sheetbase.AppError.error('my/error', 'Oops, sorry mate!', 403);
```

+ client(code, message, data)

Build client error, status 400
 
```javascript
    var error = Sheetbase.AppError.client('my/error', 'Oops, sorry mate!');
```

+ server(code, message, data)

Build server error, status 500

```javascript
    var error = Sheetbase.AppError.server('my/error', 'Oops, sorry mate!');
```


### Helper

+ o2a(object)

Turn object into array

```javascript
    var arr = Sheetbase.Helper.o2a({...});
```

+ a2o(array)

Turn array into object

```javascript
    var obj = Sheetbase.Helper.a2o([...]);
```


### Model

+ get(modelName)

Get model by model name

```javascript
    var User = Sheetbase.Model.get('User');
```

Usage: [https://github.com/316Company/tamotsux](https://github.com/316Company/tamotsux)


### Request

+ param(event, key)

Get request params, all or by key

```javascript
    var apiKey = Sheetbase.Request.param(e, 'apiKey');
```

+ body(event, key)

Get request body, all or by key

```javascript
    var apiKey = Sheetbase.Request.body(e, 'apiKey');
```



### Response

+ json(object)

Return JSON data

```javascript
    return Sheetbase.Response.json({...});
```

+ html(content, isFile)

Return HTML page

```javascript
    return Sheetbase.Response.html('<h1>Hello world!</h1>');
```

+ standard(object)

Return Sheetbase standard success data

```javascript
    return Sheetbase.Response.standard({...});
```

+ unauthorized()

Return unauthorized message

```javascript
    return Sheetbase.Response.unauthorized();
```



### HTTP

+ get(event)

Handle HTTP GET request

```javascript
    function doGet(e) { return Sheetbase.HTTP.get(e) }
```

+ post(event)

Handle HTTP POST request

```javascript
    function doPost(e) { return Sheetbase.HTTP.post(e) }
```



### Router

+ get(routeName, middleware1, ..., routeHandler)

Register a GET route

```javascript
    Sheetbase.Router.get('/', function (req, res) {
        // logic
    });
```

+ post(routeName, middleware1, ..., routeHandler)

Register a POST route

```javascript
    Sheetbase.Router.post('/', function (req, res) {
        // logic
    });
```

+ all(routeName, middleware1, ..., routeHandler)

Register a POST route

```javascript
    Sheetbase.Router.all('/', function (req, res) {
        // logic
    });
```



### Middleware

+ authorize

Check auth using 'apiKey' solution

```javascript
    app.get('/', Sheetbase.Middleware.authorize, function (req, res) {
        // logic
    });
```

+ confirmUser

Confirm user token

```javascript
    app.get('/', Sheetbase.Middleware.confirmUser, function (req, res) {
        // logic
    });
```



## Homepage

Please visit [https://sheetbase.net/](https://sheetbase.net) for more.



## Support us
[<img src="https://cloakandmeeple.files.wordpress.com/2017/06/become_a_patron_button3x.png?w=200">](https://www.patreon.com/lamnhan)