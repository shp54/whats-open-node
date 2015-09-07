var request = require('request');
var express = require('express');
var app = express();

app.use(express.static('assets'))

var api_key = 'AIzaSyAsaKDM1E9cv45rSvphS8hv1X7eKtovbBg';

function buildQueryString(params){
	var result = [];
	for(var p in params){
		result.push(p + '=' + params[p]);
	}
	return result.join('&');
}

app.get('/', function(req, res){
	res.sendfile("index.html");
});

app.get('/open', function(req, res){
	var latitude = req.query.lat;
	var longitude = req.query.long;
	console.log("Request coming from coordinates %s, %s", latitude, longitude);
	
	var parameters = {
		'key': api_key,
		'location': latitude + ',' + longitude, //has to be (latitude,longitude)
		'types': 'food',
		'rankby': 'distance',
		'opennow': ''
    }
	
	var queryString = buildQueryString(parameters);
	
	var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
	
	request(url + queryString, function(error, response, body){
		if (!error && response.statusCode == 200) {
			res.json(body); //Send body back to client, let them deal with it
		}
	});
});

var server = app.listen(3000, function(){
	var port = server.address().port;
	
	console.log('App listening on port %s', port);
});