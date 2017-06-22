let $ = require('jquery'),
	Backbone = require('backbone'),
	ResultsView = require('./results/results-view'),
	ResultsCollection = require('./results/results-collection'),
	geoPosition = require('../lib/geoPosition');
	
let AppView = Backbone.View.extend({
	el: "body",
	geoSuccess(p){
		let { latitude, longitude } = p.coords;
		console.log(`Found user's location at ${latitude}, ${longitude}`); //store position and poll loadResults repeatedly if position is gotten
		this.loadResults(latitude, longitude)
		setTimeout(() => {
			this.loadResults(latitude, longitude)
		}, 60000); 
	},
	results: new ResultsCollection(),
	geoError(p){
		alert("Couldn't find your location. We kind of need that");
	},
	loadResults(latitude, longitude){
		if(!this.results.latitude){
			this.results.latitude = latitude;
		}
		if(!this.results.longitude){
			this.results.longitude = longitude;
		}
		this.results.fetch() //Fetch automatically "smart updates" the collection, so it will always correctly rerender when something gets added or removed
	},
	initialize(){		
		geoPosition.init && geoPosition.init() && geoPosition.getCurrentPosition((p) => this.geoSuccess(p), (p) => this.geoError(p));
		this.$("#spinner").show();
		this.listenTo(this.results, "sync", () => {
			this.$("#spinner").hide();
			this.$("#subheading").css("display", "block"); //Display subheading
		});
		let resultsView = new ResultsView({ collection: this.results });
	}
});
	
function init(){
	let app = new AppView(); //Kickstart the app
}

$(() => { init() }); //Here we go!