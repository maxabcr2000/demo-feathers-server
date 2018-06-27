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
    paginate: paginate,
    id: 'sender'
  });
  
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
          
          // context.data={
          //   ...data,
          //   // sender: user.sub,
          //   createdAt: new Date().getTime(),
          // };

          context.result = context.data;
          // console.log("context.result: ", context.result);

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



