# Sheetbase Script Core

Core Module to build Sheetbase Backend. Homepage: https://sheetbase.net

## Install

Library ID: ``1ZUoDbpEwu4DC3i5tHsNMm3ng7smMWSsH4GzUvwCttlCHplOP2ly7Kzgw``

Select latest version, set Identifier to ``Sheetbase``.

## Usage

```js
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
    // "authUrl": "https://<your_domain>/<endpoint>"
});

// Step 3: register routes

app.get('/', function (req, res) {
    return res.html('<h1>Hello world!</h1>'); // return some HTML
});

app.post('/', function (req, res) {
    return res.json({me: 'Hello world!'}); // return some JSON
});

// route with middleware
app.post('/private',
function (req, res, next) {
    if(req.body.apiKey !== 'my_api_key')
        return res.json(Sheetbase.AppError.error('403', 'Unauthorized', 403)); // exit
    return next(); // continue
},
function (req, res) {
    return res.standard({hooray: 'You have passed the security check!'});
});

```

## Default routes

These routes were exposed by defaults, you can overide them in your app if you wish, authorized by using ``apiKey``.

Response can be HTML page or JSON data of ``StandardError`` or ``StandardSuccess``.

All routes accept ``apiKey`` in params or body for authorization.

### User and authentication

#### GET ``/auth/action``
Handle user authentication actions: Reset password, .... This link will be sent to user email when asked, will be replaced by using ``authUrl``.

Params:

- **mode**: Action name: passwordReset, ...
- **oobCode**: Action code

Body: n/a

Response:

Action form to do whatever action described by ``mode`` param.

#### POST ``/auth/verify-code``
Verify oob code.

Params: n/a

Body:

- **code**: Out-of-band code

Response data: 

- **code**: Oob code

#### POST ``/auth/reset-password``
Ask for password reset.

Params: n/a

Body:

- **email**: Email address to recieve password reset link

Response data:

- **email**: Email address

#### POST ``/auth/set-password``
Set new password.

Params: n/a

Body:

- **code**: Oob code
- **password**: New password

Response data:

- **code**: Oob code

#### POST ``/user/create``
Create new user.

Params: n/a

Body:

- **email**: User email
- **password**: User password

Response data:

- UserProfile

#### POST ``/user/login``
Log user in.

Params: n/a

Body:

- **email**: User email
- **password**: User password

Response data:

- UserProfile

#### GET ``/user/profile``
Get user profile.

Params:

- **token**: User token

Body: n/a

Response data:

- UserProfile

#### POST ``/user/profile``
Update user profile.

Params: n/a

Body:

- **token**: User token
- **profile**: New profile data

Response data:

- UserProfile

### Data
#### GET ``/data``
Get data.

Params:

- **table**: Table name
- **range**: (optional) A1 range to get data

Body: n/a

Response data:

- TableData

### File
#### GET ``/file``
Get file infomation.

Params:

- **id**: File id

Body: n/a

Response data:

- FileInfo

#### POST ``/file``
Upload a file.

Params: n/a

Body:

- **file**: file data to be upload
- **folder**: (optional) Custom folder name

Response data:

- FileInfo

## API

### initialize(config)
Init the library.

Params:

- **config**: Config data

Return:

- Sheetbase.Router

### Config

#### get(key)
Get config by key

### AppError

#### error(code, message, httpStatus, data)
Build an error

#### client(code, message, data)
Build client error, status 400

#### server(code, message, data)
Build server error, status 500

### Helper

#### o2a(object)
Turn object into array

#### a2o(array)
Turn array into object

### Model

#### get(modelName)
Get model by model name

### Request

#### param(event, key)
Get request params

#### body(event, key)
Get request body

#### isAuthorized()
Check app authorization status

### Response

#### json(object)
Return JSON data

#### html(content)
Return HTML page

#### standard(object)
Return Sheetbase standard JSON data

#### unauthorized()
Return unauthorized message

### Http

#### get(event, checkAuth)
Handle HTTP GET request

#### post(event, checkAuth)
Handle HTTP POST request

### Router

#### get(routeName, routeHandler)
Register a GET route

#### post(routeName, routeHandler)
Register a POST route

## Support us
[<img src="https://cloakandmeeple.files.wordpress.com/2017/06/become_a_patron_button3x.png?w=200">](https://www.patreon.com/lamnhan)