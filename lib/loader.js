'use strict';

const EggWss = require('./ws');

module.exports = app => {
  new EggWss(app);
};