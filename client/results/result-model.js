let Backbone = require('backbone'),
	$ = require('jquery'),
	moment = require('moment'),
	apiParams = require('../../api/params')

let ResultModel = Backbone.Model.extend({
	idAttribute: "place_id",
	url(){
		return `/place/${this.id}`
	},
	initialize(){ 
		$.get(this.url()).then((data) => { //Get closing time and other info
			let result = data.result
			if(result && result.opening_hours){
				let currentWeekday = moment().day()
				let hoursToday = _.find(result.opening_hours.periods, (p) => p.open.day == weekday)
				console.log(hoursToday)
				this.set('closingTime', moment(hoursToday.close.time, 'HH').format('LT'))
			}
		})
	}
});

module.exports = ResultModel;