'use strict';

module.exports = appInfo => {
  const config = exports = {
  };

  config.view = { defaultViewEngine: '.ejs', mapping: { '.ejs': 'ejs' } };

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1538310892068_3544';

  // add your config here
  config.middleware = [];

  return config;
};
exports.ejs = {};
