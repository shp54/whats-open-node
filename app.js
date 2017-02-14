let request = require('request'),
	express = require('express'),
	_ = require('underscore'),
	apiParameters = require('./api/params'),
	apiUtils = require('./api/utils');
	
let env = process.env.NODE_ENV || 'development';

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
	let latitude = req.query.lat;
	let longitude = req.query.long;
	console.log("Request coming from coordinates %s, %s", latitude, longitude);
	
	let params = _.extend(apiParameters.params, { location: `${latitude},${longitude}` }); //Add location to API parameters
	let url = apiParameters.listUrl + apiUtils.buildQueryString(params);
	request(url, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			res.json(body); //Send body back to client, let them deal with it
		}
	});
});

let server = app.listen(process.env.PORT || 3000, () => {
	let port = server.address().port;
	
	console.log('App listening on port %s', port);
});