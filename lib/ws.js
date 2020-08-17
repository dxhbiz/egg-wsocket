'use strict';

const compose = require('koa-compose');
const Router = require('@eggjs/router');
const url = require('url');
const WebSocket = require('ws');
const http = require('http');

class EggWss {
  constructor(app) {
    this.app = app;

    this.middlewares = [];
    this.router = new Router();

    this.server = new WebSocket.Server({
      noServer: true,
    });

    this.server.on('error', err => {
      app.logger.error('[egg-wsocket] error: ', err);
    });

    app.wsocket = this;
    app.on('server', server => {
      server.on('upgrade', this.upgrade.bind(this));
    })
  }

  upgrade(request, socket, head) {
    if (!request.url) {
      return this.notFound(socket);
    }

    const pathname = url.parse(request.url).pathname;
    const matches = this.router.match(pathname, 'GET');

    if (!matches.route) {
      return this.notFound(socket);
    }

    const controller = this.router.routes();
    this.server.handleUpgrade(request, socket, head, conn => {
      this.server.emit('connection', conn, request);
      const ctx = this.app.createContext(request, new http.ServerResponse(request));
      ctx.websocket = conn;
      controller(ctx).catch(e => {
        if (!ctx.websocket.CLOSED) {
          ctx.websocket.close();
        }
        ctx.onerror(e);
      });
    });
  }

  use(middleware) {
    if (isFunction(middleware)) {
      return;
    }

    if (this.middlewares.includes(middleware)) {
      return;
    }

    this.middlewares.push(middleware);
  }

  route(path, ...middleware) {
    const handler = middleware.pop();

    if (!isFunction(handler)) {
      throw new Error('egg-wsocket middleware must be function');
    }

    let appMiddlewares = [];
    if (this.app.wsocket && this.app.wsocket.useAppMiddlewares === true) {
      appMiddlewares = app.middleware;
    }

    const composeMiddleware = compose([
      ...appMiddlewares,
      ...this.middlewares,
      ...middleware,
      waitWebsocket(handler)
    ]);

    this.router.all(path, composeMiddleware);
  }

  notFound(socket) {
    socket.end('HTTP/1.1 404 Not Found\r\n\r\n');
  }
}

function isFunction(v) {
  return typeof v === 'function';
}

function waitWebsocket(controller) {
  return ctx => {
    return new Promise((resolve, reject) => {
      ctx.websocket.on('close', resolve);
      ctx.websocket.on('error', reject);
      try {
        const ret = controller.call(ctx);
        if (ret instanceof Promise) {
          ret.catch(reject);
        }
      } catch (e) {
        reject(e);
      }
    });
  };
}

module.exports = EggWss;