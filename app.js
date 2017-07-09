let Promise = require('bluebird')
	request = Promise.promisify(require('request')),
	express = require('express'),
	memjs = require('memjs'),
	_ = require('underscore'),
	apiParameters = require('./api/params'),
	apiUtils = require('./api/utils');

let env = process.env.NODE_ENV || 'development';

let cache = Promise.promisifyAll(memjs.Client.create())

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
	let { lat, long } = req.query
	let location = `${lat},${long}` 
	let params = _.extend(apiParameters.params, { location }); //Add location to API parameters
	let apiUrl = apiParameters.listUrl + apiUtils.buildQueryString(params);
		
	cache.getAsync(location).then((val) => {
		if(val){
			console.log(`Request coming from coordinates ${lat}, ${long} - cache hit`);
			return Promise.resolve(val.toString());
		} else {
			console.log(`Request coming from coordinates ${lat}, ${long} - cache miss`);
			return request(apiUrl).then((response) => {
				if (response.statusCode == 200) { //Send body back to client, let them deal with it
					cache.set(location, response.body, {expires: 60}) //Store it in cache for later (expire it in one minute so it refreshes)
					return response.body;
				}
			})
		}
	});
});

app.get('/place/:placeId', (req, res) => {
	let placeid = req.params.placeId
	let apiUrl = apiParameters.placeUrl + apiUtils.buildQueryString({ placeid, key: apiParameters.apiKey })
	
	cache.getAsync(placeid).then((val) => {
		if(val){
			return Promise.resolve(val.toString())
		} else {
			request(apiUrl).then((response) => {
				if (response.statusCode == 200) { //Send body back to client, let them deal with it
					cache.set(placeid, response.body, {});
					return response.body;
				}
			})
		}	
	}).then((body) => {
		res.setHeader('content-type', 'application/json'); 
		res.send(body);
	})
})

let server = app.listen(process.env.PORT || 3000, () => {
	let port = server.address().port;
	
	console.log('App listening on port %s', port);
});