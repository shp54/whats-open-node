$(document).ready(function(){
	
	appEvents = _.extend({}, Backbone.Events);
	
	let ResultsCollection = Backbone.Collection.extend({
		initialize(models, options){
			this.latitude = options && options.latitude; 
			this.longitude = options && options.longitude; 
		},
		url(){
			return `/open?${buildQueryString({
				"lat": this.latitude,
				"long": this.longitude
			})}` 
		},
		parse(data){
			return JSON.parse(data).results;
		}
	});
	
	let ResultsView = Backbone.View.extend({
		el: "#results",
		template: Handlebars.compile($("#results-template").text()),
		initialize(options){
			this.listenTo(this.collection, "change", this.render);
			this.render();
		},
		render(){
			this.$el.html(this.template(this.collection.toJSON()));
			return this;
		}
	});
	
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
			geoPosition.init && geoPosition.init() && geoPosition.getCurrentPosition(this.geoSuccess.bind(this), this.geoError.bind(this));
			
			this.listenTo(appEvents, "app:loadResults", (results) => {
				this.$("#subheading").css("display", "block"); //Display subheading
				let resultsView = new ResultsView({ collection: results });
			});
		}
	});
	
	let app = new AppView(); //Kickstart the app
});