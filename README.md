# Sheetbase Script Core

Core Module to build Sheetbase Backend. Homepage: https://sheetbase.net

## Install

Library ID: ``1ZUoDbpEwu4DC3i5tHsNMm3ng7smMWSsH4GzUvwCttlCHplOP2ly7Kzgw``

Select latest version, set Identifier to ``Sheetbase``.

## Usage

```js

// Init the library
Sheetbase.initialize(SHEETBASE_CONFIG(), APP_CONFIG());

// return some JSON
Sheetbase.Response.json({me: 'Hello world!'});

```

## API

### Config

#### get(key)

### AppError

#### make(code, message)

### Helper

#### o2a(object)

#### a2o(array)

### Model

#### get(modelName)

### Request

#### param(event, key)

#### body(event, key)

#### isAuthorized()

### Response

#### json(object)

#### html(content)

#### unauthorized()

## Support us
[<img src="https://cloakandmeeple.files.wordpress.com/2017/06/become_a_patron_button3x.png?w=200">](https://www.patreon.com/lamnhan)