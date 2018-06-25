// eslint-disable-next-line no-unused-vars
const knex = require('knex');
const service = require('feathers-knex');
const auth = require('@feathersjs/authentication');
const { disallow } = require('feathers-hooks-common');

module.exports = function (app) {
  
  const db = knex({
    client: 'pg',
    connection: app.get('pgconnection')
  });

  const paginate = app.get('paginate');

  //Create the schema
  db.schema.createTable('messages',table => {
    table.increments('id');
    table.string('content');
    table.string('sender');
    table.string('receiver');
    table.bigInteger('createdAt');
  });
  // }).then( () => {
  //   console.log('After create table');
  // }).catch( err => {
  //   console.log(err);
  // });

  let messagesServ = service({
    Model: db,
    name: 'messages',
    paginate: paginate
  });

  // messagesServ.create = (data, params) => {
  //   console.log("params from test.create: ", params);

  //   return Promise.resolve(data);
  // };

  // messagesServ.update = (id, data, params) => {
  //   console.log("params from test.update: ", params);

  //   return Promise.resolve(data);
  // };

  // messagesServ.remove = (id, params) => {
  //   console.log("params from test.remove: ", params);

  //   return Promise.resolve(data);
  // };
  
  app.use('/messages', messagesServ);
  
  app.service('messages').hooks({
    before: {
      all: [auth.hooks.authenticate('jwt')],
      find: [ 
        function(context){
          console.log("find hook:", context.params);
          context.params.query = {
            sender: context.params.payload.sub
          };

          return context;
        }
      ],
      get: [
        function(context){
          console.log("get hook:", context.params);
          context.params.query = {
            sender: context.params.payload.sub
          };

          return context;
        }
      ],
      create: [
        disallow('external'),
        function(context){
          console.log("create hook:", context.params);

          // const user = context.params.user;
          const data = context.data;
          
          context.data={
            ...data,
            // sender: user.sub,
            createdAt: new Date().getTime(),
          };

          context.result = context.data;

          return context;
        }
      ],
      update: [
        disallow('external'),
        function(context){
          console.log("update hook:", context.params);

          // const user = context.params.user;
          const data = context.data;
          
          context.data={
            ...data,
            // sender: user.sub,
            createdAt: new Date().getTime(),
          };

          context.result = context.data;

          return context;
        }
    ],
      patch: [disallow('external')],
      remove: [
        disallow('external'),
        function(context){
          console.log("remove hook:", context.params);

          context.result = context.params.old;

          return context;
        }
      ]
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



