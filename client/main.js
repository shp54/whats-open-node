let $ = require('jquery'),
	Backbone = require('backbone'),
	ResultsView = require('./results/results-view'),
	ResultsCollection = require('./results/results-collection'),
	geoPosition = require('../lib/geoPosition');
	
let AppView = Backbone.View.extend({
	el: "body",
	geoSuccess(p){
		console.log(`Found user's location at ${p.coords.latitude}, ${p.coords.longitude}`);
		//store position and poll loadResults repeatedly if position is gotten
		this.loadResults(p.coords.latitude, p.coords.longitude)
		setTimeout(() => {
			this.loadResults(p.coords.latitude, p.coords.longitude)
		}, 60000); 
	},
	geoError(p){
		alert("Couldn't find your location. We kind of need that");
	},
	loadResults(latitude, longitude){
		let results = new ResultsCollection([], { latitude: latitude, longitude: longitude });
		results.fetch().done(() => { Backbone.trigger("app:loadResults", results); });
	},
	initialize(){		
		geoPosition.init && geoPosition.init() && geoPosition.getCurrentPosition((p) => this.geoSuccess(p), (p) => this.geoError(p));
		this.$("#spinner").show();
		this.listenTo(Backbone, "app:loadResults", (results) => {
			this.$("#spinner").hide();
			this.$("#subheading").css("display", "block"); //Display subheading
			let resultsView = new ResultsView({ collection: results });
		});
	}
});
	
function init(){
	let app = new AppView(); //Kickstart the app
}

$(document).ready(function(){	
	init();
});