let apiUrl = require('./params').url; 

function buildQueryString(params){
	let result = [];
	for(let p in params){
		result.push(p + '=' + params[p]);
	}
	return result.join('&');
}

function buildUrl(params){
	return apiUrl + buildQueryString(params);
}

module.exports = {
	buildQueryString: buildQueryString,
	buildUrl: buildUrl
}