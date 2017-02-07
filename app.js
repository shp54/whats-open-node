var request = require('request');
var express = require('express');
var assign = require('object-assign')
var apiParameters = require('./assets/js/apiParams')
var apiUtils = require('./assets/js/apiUtils')

var app = express();
app.use(express.static('assets'))

app.get('/', function(req, res){
	res.sendfile("index.html");
});

app.get('/open', function(req, res){
	var latitude = req.query.lat;
	var longitude = req.query.long;
	console.log("Request coming from coordinates %s, %s", latitude, longitude);
	
	var params = assign(apiParameters.params, { location: latitude + ',' + longitude })//Add location to API parameters
	var url = apiUtils.buildUrl(params);
	request(url, function(error, response, body){
		if (!error && response.statusCode == 200) {
			res.json(body); //Send body back to client, let them deal with it
		}
	});
});

var server = app.listen(3000, function(){
	var port = server.address().port;
	
	console.log('App listening on port %s', port);
});