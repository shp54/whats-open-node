let _ = require('underscore'); 

function buildQueryString(params){
	return _.chain(params).keys().inject((acc, item) => acc.concat(`${item}=${params[item]}`), []).join("&").value();	
}

module.exports = {
	buildQueryString: buildQueryString
}