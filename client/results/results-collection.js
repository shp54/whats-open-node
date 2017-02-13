let Backbone = require('backbone'),
	apiUtils = require('../../api/utils');

let ResultsCollection = Backbone.Collection.extend({
	initialize(models, options){
		this.latitude = options && options.latitude; 
		this.longitude = options && options.longitude; 
	},
	url(){
		return `/open?${apiUtils.buildQueryString({
			"lat": this.latitude,
			"long": this.longitude
		})}` 
	},
	parse(data){
		return JSON.parse(data).results;
	}
});

module.exports = ResultsCollection;