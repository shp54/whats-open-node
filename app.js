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
  port: process.env.PORT || 3000,
});

server.route({
  method: 'GET',
  path: '/open',
  handler: (request, h) => {
    const { lat, long } = request.query;
    const location = `${lat},${long}`;
    const qs = {
      key: apiParameters.apiKey,
      location,
      type: 'restaurant',
      rankby: 'distance',
      opennow: 'true',
    };

    console.log(`Request sent from ${location}`);

    return fetch(makeUrl(apiParameters.listUrl, qs)).then(result => result.json());
  },
});

server.route({
  method: 'GET',
  path: '/place/{placeid}',
  handler: async (request, h) => {
    const { placeid } = request.params;
    const qs = {
        placeid,
        key: apiParameters.apiKey,
    };

    const fetchPlace = fetch(makeUrl(apiParameters.placeUrl, qs)).then(result => result.json());

    try {
      const val = await cacheGet(placeid);
      if(val) {
        return JSON.parse(val.toString());
      } else {
        const response = await fetchPlace;
        await cacheSet(placeid, JSON.stringi
          fy(response), {});
        return response;
      }
    } catch(err) {
      return await fetchPlace;
    }
  },
});

// Forces https in production
if(env === 'production'){
  server.ext({
    type: 'onRequest',
    method: (request, h) => {
      if(request.headers['x-forwarded-proto'] !== 'https') {
        return h.redirect('https://' + request.info.host + request.url);
      }
      return h.continue;
    },
  });
}

const startServer = async () => {
  // Static file handling - serves everything from the assets directory at the root
  await server.register(inert);

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

  await server.start();
  console.log(`Server started on port ${server.info.port}!`);
};

startServer();
