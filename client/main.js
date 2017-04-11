let $ = require('jquery'),
	Backbone = require('backbone'),
	ResultsView = require('./results/results-view'),
	ResultsCollection = require('./results/results-collection'),
	appEvents = require('./events'),
	geoPosition = require('../lib/geoPosition');
	
let AppView = Backbone.View.extend({
	el: "body",
	geoSuccess(p){
		console.log(`Found user's location at ${p.coords.latitude}, ${p.coords.longitude}`);
		let results = new ResultsCollection([], { latitude: p.coords.latitude, longitude: p.coords.longitude });
		results.fetch().done(() => { appEvents.trigger("app:loadResults", results); });
	},
	geoError(p){
		alert("Couldn't find your location. We kind of need that");
	},
	initialize(){			
		geoPosition.init && geoPosition.init() && geoPosition.getCurrentPosition((p) => this.geoSuccess(p), (p) => this.geoError(p));
		
		this.$el.html("<div id='spinner'><img src='/images/spinner.gif'></div>")
		
		this.listenTo(appEvents, "app:loadResults", (results) => {
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