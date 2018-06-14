/* eslint-disable no-console */
const logger = require('winston');
const app = require('./app');
const {Client} = require('pg');
const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
);

const client = new Client(app.get('pgconnection'));
client.connect();

client.on('notification', function(msg) {
  console.log('pgclient on notification: ', msg);
});

client.query('LISTEN watchers')  
  .then(res => {
    console.log(res.rows);
  })
  .catch(e => {
    console.error(e.stack);
  });

console.log("Complete pg setting");