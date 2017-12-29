const fetch = require('node-fetch');
const querystring = require('querystring');
const hapi = require('hapi');
const inert = require('inert');
const memjs = require('memjs');
const Promise = require('bluebird');
const apiParameters = require('./api/params')

const env = process.env.NODE_ENV || 'development';

const cache = memjs.Client.create();
const cacheSet = Promise.promisify(cache.set, {context: cache});
const cacheGet = Promise.promisify(cache.get, {context: cache});

const makeUrl = (url, paramsObj) => url + '?' + querystring.stringify(paramsObj);

const server = hapi.server({
  port: 3000,
});

const startServer = async () => {
  await server.register(inert)

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: './assets',
        redirectToSlash: true,
        index: true,
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/open',
    handler: (request, h) => {
      const { lat, long } = request.query;
      const location = `${lat},${long}`;
      console.log(`Request sent from ${location}`);
      const qs = {
        key: apiParameters.apiKey,
        location,
        type: 'restaurant',
        rankby: 'distance',
        opennow: 'true',
      };

      return fetch(makeUrl(apiParameters.listUrl, qs)).then(result => result.json());
    },
  });

  server.route({
    method: 'GET',
    path: '/place/{placeid}',
    handler: (request, h) => {
      const { placeid } = request.params;
      const qs = {
          placeid,
          key: apiParameters.apiKey,
      };

      const fetchPlace = fetch(makeUrl(apiParameters.placeUrl, qs)).then(result => result.json());

      return cacheGet(placeid)
            .then(val => {
              if(!val){
                return fetchPlace.then(response => {
                  cacheSet(placeid, JSON.stringify(response), {});
                  return response;
                });
              } else {
                return JSON.parse(val.toString());
              }
            })
            .catch(err => fetchPlace);
    },
  });

  await server.start();
  console.log('Server started on port 3000!');
};

startServer();
