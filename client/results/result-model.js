let Backbone = require('backbone'),
	ResultDecorator = require('./result-decorator')

let ResultModel = Backbone.Model.extend({
	idAttribute: "place_id",
	url(){
		return `/place/${this.id}`
	},
	initialize(){
		this.fetch()
	},
	toJSON(){
		return ResultDecorator.decorate(this.attributes) //Decorate the default JSON with extra data
	}
});

module.exports = ResultModel;