'use strict';

const mock = require('egg-mock');

describe('test/wsocket.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/wsocket-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, wsocket')
      .expect(200);
  });
});
