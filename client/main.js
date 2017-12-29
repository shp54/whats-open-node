const { h, app } = require('hyperapp');

const state = { 
 isLoading: true,
 lat: 42.3565551,
 long: -71.18526419999999,
 results: [],
};

const actions = {
  setResults: results => (state, actions) => ({ results }),
  setLoading: isLoading => (state, actions) => ({ isLoading }),
  fetchData: () => (state, actions) => { 
    actions.setLoading(true);
    fetch(`/open?lat=${state.lat}&long=${state.long}`)
      .then(res => res.json())
      .then(data => {
	actions.setLoading(false);
	actions.setResults(data.results);
      });
  },
};

const view = (state, actions) => h("div", {}, [
  h("div", {}, state.loading ? "Loading..." : "Done"),
  h("div", {}, JSON.stringify(state.results)),
]);

const main = app(state, actions, view, document.body);

main.fetchData();
/* let $ = require('jquery'),
	Backbone = require('backbone'),
	ResultsView = require('./results/results-view'),
	ResultsCollection = require('./results/results-collection'),
	geoPosition = require('../lib/geoPosition');
	
let AppView = Backbone.View.extend({
	el: "body",
	geoSuccess(p){
		let { latitude, longitude } = p.coords;
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

$(() => { init() }); //Here we go! */
