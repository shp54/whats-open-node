var apiUrl = require('./parameters').url

module.exports = {
	buildQueryString: function(params){
						var result = [];
						for(var p in params){
							result.push(p + '=' + params[p]);
						}
						return result.join('&');
					},
	buildUrl: function(params){
				return apiUrl + this.buildQueryString(params)
			}
}
