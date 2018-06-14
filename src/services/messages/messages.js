// eslint-disable-next-line no-unused-vars
const knex = require('knex');
const service = require('feathers-knex');
const auth = require('@feathersjs/authentication');

module.exports = function (app) {
  
  const db = knex({
    client: 'pg',
    connection: app.get('pgconnection')
  });

  const paginate = app.get('paginate');

  //Create the schema
  db.schema.createTable('messages',table => {
    table.increments('id');
    table.string('text');
    table.string('sender');
    table.string('receiver');
    table.bigInteger('createdAt');
  }).then( () => {
    console.log('After create table');
  }).catch( err => {
    console.log(err);
  });
  
  app.use('/messages', service({
    Model: db,
    name: 'messages',
    paginate: paginate
  }));
  
  app.service('messages').hooks({
    before: {
      all: [auth.hooks.authenticate('jwt'),
        function(context){
          console.log("all hook:", context.params);

          return context;
        }
      ],
      find: [ 
        function(context){
          console.log("find hook:", context.params);
          context.params.query = {
            sender: context.params.user.username
          };

          return context;
        }
      ],
      get: [
        function(context){
          console.log("get hook:", context.params);
          context.params.query = {
            sender: context.params.user.username
          };

          return context;
        }
      ],
      create: [
        function(context){
          console.log("create hook:", context.params);

          const user = context.params.user;
          const data = context.data;
          
          context.data={
            ...data,
            sender: user.username,
            createdAt: new Date().getTime(),
          };

          return context;
        }
      ],
      update: [],
      patch: [],
      remove: []
    },
    after: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    }
  });
};



