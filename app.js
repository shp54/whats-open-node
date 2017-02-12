let request = require('request'),
	express = require('express'),
	assign = require('object-assign'),
	apiParameters = require('./api/params'),
	apiUtils = require('./api/utils');

let app = express();
app.use(express.static('assets'))

app.get('/', (req, res) => {
	res.sendfile("index.html");
});

app.get('/open', (req, res) => {
	let latitude = req.query.lat;
	let longitude = req.query.long;
	console.log("Request coming from coordinates %s, %s", latitude, longitude);
	
	let params = assign(apiParameters.params, { location: `${latitude},${longitude}` })//Add location to API parameters
	let url = apiUtils.buildUrl(params);
	request(url, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			res.json(body); //Send body back to client, let them deal with it
		}
	});
});

let server = app.listen(3000, () => {
	let port = server.address().port;
	
	console.log('App listening on port %s', port);
});