// eslint-disable-next-line no-unused-vars
const auth = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const Verifier = require('@feathersjs/authentication-jwt').Verifier;
const custom = require('feathers-authentication-custom');
// const { disallow } = require('feathers-hooks-common');

class SimpleVerifier extends Verifier {
  // The verify function has the exact same inputs and 
  // return values as a vanilla passport strategy
  verify(req, payload, done) {
    // do your custom stuff. You can call internal Verifier methods
    // and reference this.app and this.options. This method must be implemented.

    // the 'user' variable can be any truthy value
    // the 'payload' is the payload for the JWT access token that is generated after successful authentication
    
    done(null, {}, payload);
  }
}

class CustomVerifier {
  // The verify function has the exact same inputs and 
  // return values as a vanilla passport strategy
  constructor(app, options) {
    // super();
    this.app = app;
    this.options = options;

    console.log("CustomVerifier.app: ", app);
    console.log("CustomVerifier.options: ", options);
  } 
  verify(req, done) {
    // do your custom stuff. You can call internal Verifier methods
    // and reference this.app and this.options. This method must be implemented.

    this.app.passport.verifyJWT(req.body.accessToken, this.options)
      .then( payload => {
      console.log("Outer JWT Payload: ", payload);

      done(null, payload);

    }).catch( err => {
      console.log(err);
      throw new Error('JWT verification failed!');
    });

  }
}


module.exports = function (app) {
  const options = app.get('authentication');
  const customOpts = app.get('custom');

  app.configure(auth(options));
  app.configure(jwt({ Verifier: SimpleVerifier }));
  app.configure(custom({ Verifier: CustomVerifier, ...customOpts }));


  app.service('authentication').hooks({
    before: {
      create: [
      // You can chain multiple strategies
        //disallow('external'),
        auth.hooks.authenticate(['custom']),
        context => {
          
          const payload = context.params.user;
          context.params.payload = context.params.payload || {};
          // merge in a `test` property
          Object.assign(context.params.payload, {rle: payload.rle});

          context.params.jwt = {
            subject: payload.sub,
            // maxAge: (payload.exp - payload.iat) * 1000
          };

          console.log("auth before hook on create: ", context);

          return context;
        }
      ],
      remove: [
        auth.hooks.authenticate('custom')
      ]
    }
  });
};



