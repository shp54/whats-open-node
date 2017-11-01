let request = require('request-promise'),
    express = require('express'),
    memjs = require('memjs'),
    _ = require('underscore'),
    Promise = require('bluebird'),
    apiParameters = require('./api/params')

let env = process.env.NODE_ENV || 'development';

let cache = memjs.Client.create(),
    cacheSet = Promise.promisify(cache.set, {context: cache}),
    cacheGet = Promise.promisify(cache.get, {context: cache})

let app = express();

//Taken from http://stackoverflow.com/questions/7185074/heroku-nodejs-http-to-https-ssl-forced-redirect 
//Forces redirect to SSL in production so that location sensing API will work automatically
let forceSsl = (req, res, next) => {
  if(req.headers['x-forwarded-proto'] !== 'https'){
    return res.redirect('https://' + req.get('Host') + req.url); 
  }
  return next();
}

if(env === 'production'){
  app.use(forceSsl);
}

app.use(express.static('assets')); //Static assets directory

app.get('/', (req, res) => {
  res.sendfile("index.html");
});

app.get('/open', (req, res) => {
  let { lat, long } = req.query,
      options = { 
        url: apiParameters.listUrl,
        qs: _.extend(apiParameters.params, { location: `${lat},${long}` })
      }
    
  request(options).then((response) => {
    res.setHeader('content-type', 'application/json'); 
    res.send(response);
  });
});

app.get('/place/:placeId', (req, res) => {
  let placeid = req.params.placeId,
      options = { 
        uri: apiParameters.placeUrl,
        qs: {
          placeid,
          key: apiParameters.apiKey
        }
      }

  cacheGet(placeid).then((val) => {
    if(val){
      return val.toString()
    } else {
      return request(options).then((response) => cacheSet(placeid, response, {}).then((val) => val.toString()));
    }
  }).then((response) => {
    res.setHeader('content-type', 'application/json'); 
    res.send(response);		
  });
});

let server = app.listen(process.env.PORT || 3000, () => {
  let port = server.address().port;

  console.log('App listening on port %s', port);
});