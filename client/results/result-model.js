let Backbone = require('backbone'),
	ResultDecorator = require('./result-decorator')

let ResultModel = Backbone.Model.extend({
	idAttribute: "place_id",
	urlRoot: "/place",
	initialize(){
		this.fetch()
	},
	toJSON(){
		return ResultDecorator.initialize(this.attributes).decorate() //Decorate the default JSON with extra data
	}
});

module.exports = ResultModel;