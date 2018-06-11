// eslint-disable-next-line no-unused-vars
const auth = require('@feathersjs/authentication');
const local = require('@feathersjs/authentication-local');
const jwt = require('@feathersjs/authentication-jwt');

module.exports = function (app) {
  const options = app.get('authentication');

  app.configure(auth(options));
  app.configure(local());
  app.configure(jwt());

  // console.log("localModule:", local.hooks);
  // console.log("jwtModule:", jwt);

  app.service('authentication').hooks({
    before: {
      create: [
      // You can chain multiple strategies
        auth.hooks.authenticate(['jwt', 'local']),
      ],
      remove: [
        auth.hooks.authenticate('jwt')
      ]
    }
  });
};



