// eslint-disable-next-line no-unused-vars
const knex = require('knex');
const service = require('feathers-knex');
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks;

module.exports = function (app) {
  const db = knex({
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: '123456',
      database: 'postgres',
      charset: 'utf8'
    }
  });

  const paginate = app.get('paginate');

  // Create the schema
  // db.schema.createTable('messages',table => {
  //   table.increments('id');
  //   table.string('text');
  //   table.string('userId');
  //   table.bigInteger('createdAt');
  // }).then( () => {
  //   console.log('After create table');
  // }).catch( err => {
  //   console.log(err);
  // });

  db.schema.createTable('users',table => {
    table.increments();
    table.string('username');
    table.string('password');
    table.integer('authlevel');
  }).then( () => {
    console.log('After create table');
  }).catch( err => {
    console.log(err);
  });
  
  // app.use('/messages', service({
  //   Model: db,
  //   name: 'messages',
  //   paginate: paginate
  // }));
  
  app.use('/users', service({
    Model: db,
    name: 'users',
    paginate: paginate
  }));

  // app.service('messages').hooks({
  //   all: [],
  //   find: [],
  //   get: [],
  //   create: [],
  //   update: [],
  //   patch: [],
  //   remove: []
  // });
  app.service('users').hooks({
    before: {
      all: [],
      find: [],
      get: [],
      //#IMPORTANT: Must use hashPassword() here! The default verifier class under Authentication Service will use the same hash algorithm!
      create: [hashPassword()],
      update: [],
      patch: [],
      remove: []
    },
    after: {
      all: [],
      find: [],
      get: [],
      create: [protect('password')],
      update: [],
      patch: [],
      remove: []
    }
  });
};



