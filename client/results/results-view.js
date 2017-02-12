let Backbone = require('backbone'),
	resultsTemplate = require('../../templates/results.hbs');

let ResultsView = Backbone.View.extend({
	el: "#results",
	template: resultsTemplate,
	initialize(options){
		this.listenTo(this.collection, "change", this.render);
		this.render();
	},
	render(){
		this.$el.html(this.template(this.collection.toJSON()));
		return this;
	}
});

module.exports = ResultsView;