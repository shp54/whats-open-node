let Backbone = require('backbone'),
	ResultView = require('./result-view')

let ResultsView = Backbone.View.extend({
	el: "#results",
	initialize(options){
		this.listenTo(this.collection, "change", this.render);
		this.render();
	},
	render(){
		this.$el.html("<ul class='list-group'></ul>");
		this.collection.each((model) => {
			this.$("ul").append(new ResultView({ model }).render().$el);
		});
		return this;
	}
});

module.exports = ResultsView;