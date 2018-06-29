// eslint-disable-next-line no-unused-vars
const memory = require('feathers-memory');
const messages = require('./messages/messages.js');
const { disallow } = require('feathers-hooks-common');
// const test = require('./test/test.js');


module.exports = function (app) {
  app.configure(messages);
  

  app.use('/users', memory());
  app.service('users').hooks({
    before: {
      all: [disallow()]
    }
  });
  // app.configure(test);
};



