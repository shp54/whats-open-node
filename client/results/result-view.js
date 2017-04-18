let Backbone = require('backbone'),
	resultsTemplate = require('../../templates/results.hbs');

let ResultsView = Backbone.View.extend({
	tagName: "li",
	className: "list-group-item",
	template: resultsTemplate,
	render(){
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

module.exports = ResultsView;