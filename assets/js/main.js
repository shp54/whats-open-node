$(document).ready(function(){
	
	appEvents = _.extend({}, Backbone.Events);
	
	var ResultsCollection = Backbone.Collection.extend({
		initialize: function(models, options){
			this.latitude = options && options.latitude; 
			this.longitude = options && options.longitude; 
		},
		url: function(){
			return "/open?" + buildQueryString({
				"lat": this.latitude,
				"long": this.longitude
			}) 
		},
		parse: function(data){
			var data = JSON.parse(data);
			return data.results;
		}
	});
	
	var ResultsView = Backbone.View.extend({
		el: "#results",
		template: Handlebars.compile($("#results-template").text()),
		initialize: function(options){
			this.listenTo(this.collection, "change", this.render);
			this.render();
		},
		render: function(){
			this.$el.html(this.template(this.collection.toJSON()));
			return this;
		}
	});
	
	var AppView = Backbone.View.extend({
		el: "body",
		geoSuccess: function(p){
			var view = this;
			console.log("Found user's location at " + p.coords.latitude + ", " + p.coords.longitude);
			this.results = new ResultsCollection([], { latitude: p.coords.latitude, longitude: p.coords.longitude });
			this.results.fetch().done(function(){
				appEvents.trigger("app:loadResults")
			});
		},
		geoError: function(p){
			alert("Couldn't find your location. We kind of need that");
		},
		initialize: function(){			
			var view = this;
			
			geoPosition.init && geoPosition.init() && geoPosition.getCurrentPosition(this.geoSuccess.bind(this), this.geoError.bind(this));
			
			this.listenTo(appEvents, "app:loadResults", function(){
				view.$("#subheading").css("display", "block"); //Display subheading
				var resultsView = new ResultsView({ collection: view.results });
			});
		}
	});
	
	var app = new AppView(); //Kickstart the app
});