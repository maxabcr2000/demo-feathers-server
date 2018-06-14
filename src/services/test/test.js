const { disallow } = require('feathers-hooks-common');

module.exports = function (app){
  class MyService {
    find(params) {
      return Promise.resolve([]);
    }
    get(id, params) {
      return Promise.resolve([]);
    }
    create(data, params) {
      console.log("params from test.create: ", params);

      return Promise.resolve(data);
    }
    update(id, data, params) {
      return Promise.resolve([]);
    }
    patch(id, data, params) {
      return Promise.resolve([]);
    }
    remove(id, params) {
      return Promise.resolve([]);
    }
    setup(app, path) {
      return Promise.resolve([]);
    }
  }
    
  app.use('/my-service', new MyService());

  app.service('my-service').hooks({
    before: {
      all: [disallow('external')],
      find: [],
      get: [],
      create: [],
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