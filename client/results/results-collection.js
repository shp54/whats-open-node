let Backbone = require('backbone'),
	ResultModel = require('./result-model')
  
let ResultsCollection = Backbone.Collection.extend({
	model: ResultModel,
	initialize(models, options){
		this.latitude = options && options.latitude; 
		this.longitude = options && options.longitude; 
	},
	url(){
		return `/open?$lat=${this.latitude}&long=${this.longitude}` 
	},
	parse(data){
		return data.results;
	}
});

module.exports = ResultsCollection;