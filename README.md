# egg-wsocket

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-wsocket.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-wsocket
[travis-image]: https://img.shields.io/travis/eggjs/egg-wsocket.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-wsocket
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-wsocket.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-wsocket?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-wsocket.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-wsocket
[snyk-image]: https://snyk.io/test/npm/egg-wsocket/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-wsocket
[download-image]: https://img.shields.io/npm/dm/egg-wsocket.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-wsocket

<!--
Description here.
-->

## Install

```bash
$ npm i egg-wsocket --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.wsocket = {
  enable: true,
  package: 'egg-wsocket',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.wsocket = {
};
```

## Router

```js
// {app_root}/app/router.js
app.wsocket.route('/ws', app.controller.home.ws);
```

## Controller

```js
// {app_root}/controller/home.js
import { Controller } from 'egg';

export default class HomeController extends Controller {
  async ws() {
    const { ctx } = this;
    if (!ctx.wsocket) {
      throw new Error('this function can only be use in egg-wsocket router');
    }

    console.log('client connected');

    ctx.wsocket
      .on('message', (msg) => {
        console.log('receive', msg);
      })
      .on('close', (code, reason) => {
        console.log('websocket closed', code, reason);
      });
  }
}
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/eggjs/egg/issues).

## License

[MIT](LICENSE)
