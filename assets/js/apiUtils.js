var apiUrl = (typeof process !== 'undefined') ? require('./apiParams').url : ""; //only import URL if we're running on the server - fix with browserify

function buildQueryString(params){
	var result = [];
	for(var p in params){
		result.push(p + '=' + params[p]);
	}
	return result.join('&');
}

function buildUrl(params){
	return apiUrl + buildQueryString(params);
}

if(typeof module !== 'undefined'){
	module.exports = {
		buildQueryString: buildQueryString,
		buildUrl: buildUrl
	}
}