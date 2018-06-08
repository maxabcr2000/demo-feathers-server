// eslint-disable-next-line no-unused-vars
const knex = require('knex');
const service = require('feathers-knex');

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

  // Create the schema
  db.schema.createTable('messages',table => {
    table.increments('id');
    table.string('text');
    table.string('userId');
    table.bigInteger('createdAt');
  }).then( () => {
    console.log('After create table');
  }).catch( err => {
    console.log(err);
  });

  db.schema.createTable('users',table => {
    table.increments();
    table.string('email');
    table.string('password');
    table.string('avatar');
  }).then( () => {
    console.log('After create table');
  }).catch( err => {
    console.log(err);
  });
  
  app.use('/messages', service({
    Model: db,
    name: 'messages'
  }));
  
  app.use('/users', service({
    Model: db,
    name: 'users'
  }));
};



