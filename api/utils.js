var apiUrl = require('./parameters').url

function buildQueryString(params){
	var result = [];
	for(var p in params){
		result.push(p + '=' + params[p]);
	}
	return result.join('&');
}

function buildUrl(params){
	return apiUrl + buildQueryString(params)
}

module.exports = {
	buildQueryString: buildQueryString,
	buildUrl: buildUrl
}
