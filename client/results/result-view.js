let Backbone = require('backbone'),
	resultsTemplate = require('../../templates/results.hbs');

let ResultView = Backbone.View.extend({
	tagName: "li",
	className: "list-group-item",
	template: resultsTemplate,
	initialize(options){
		this.listenTo(this.model, "change", this.render);
	},
	render(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

module.exports = ResultView;