let _ = require('underscore'),
	apiUrl = require('./params').url; 

function buildQueryString(params){
	return _.chain(params).keys().inject((acc, item) => acc.concat(`${item}=${params[item]}`), []).join("&").value();	
}

function buildUrl(params){
	return apiUrl + buildQueryString(params);
}

module.exports = {
	buildQueryString: buildQueryString,
	buildUrl: buildUrl
}