let Backbone = require('backbone'),
	apiParams = require('../../api/params')

let ResultModel = Backbone.Model.extend({
	idAttribute: "place_id",
	url(){
		return `https://maps.googleapis.com/maps/api/place/details/json?placeid=${this.id}&key=${apiParams.apiKey}`
	},
	initialize(){
		console.log(this.url());
	}
});

module.exports = ResultModel;