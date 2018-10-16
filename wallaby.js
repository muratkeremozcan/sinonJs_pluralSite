'use strict';

module.exports = function () {
  return {
    files: [ // trace the spec's require chain and include all the files
      './server/config/config.json',
      './server/models/*.js',
      './server/crud.js',
      './server/responses.js',
      './server/controllers/crud.controller.js',
      './server/controllers/user.controller.js',
      './server/controllers/book.controller.js',
    ],

    tests: [
      './test/*.spec.js',
    ],

    env: {
      type: 'node'
    }
  };
};