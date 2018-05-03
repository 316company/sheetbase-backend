# Sheetbase Script Core

Core Module to build Sheetbase Backend. Homepage: https://sheetbase.net

## Install

Library ID: ``1ZUoDbpEwu4DC3i5tHsNMm3ng7smMWSsH4GzUvwCttlCHplOP2ly7Kzgw``

Select latest version, set Identifier to ``Sheetbase``.

## Usage

```js

// Init the library
Sheetbase.initialize(Object.assign({},
    SHEETBASE_CONFIG(),
    APP_CONFIG()
));

// return some HTML
Sheetbase.Router.get('/', function (params, body) {
    return Sheetbase.Response.html('<h1>Hello world!</h1>');
});

// return some JSON
Sheetbase.Router.post('/', function (params, body) {
    return Sheetbase.Response.json({me: 'Hello world!'});
});

```

## API

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