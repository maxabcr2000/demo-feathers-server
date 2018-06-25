// eslint-disable-next-line no-unused-vars

const messages = require('./messages/messages.js');
const users = require('./users/users.js');
// const test = require('./test/test.js');


module.exports = function (app) {
  app.configure(messages);
  app.configure(users);
  // app.configure(test);
};



