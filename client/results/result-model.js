let Backbone = require('backbone'),
	$ = require('jquery'),
	_ = require('underscore'),
	moment = require('moment')

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
				let hoursToday = {}
				if(result.opening_hours.periods.length > 0){ //if there's more than one period, find the one for the current weekday
					hoursToday = _.find(result.opening_hours.periods, (p) => p.open.day == currentWeekday)
				} else { //otherwise just find the one they got
					hoursToday = result.opening_hours.periods[0]
				}
				console.log(hoursToday)
				if(hoursToday.close){
					this.set('closingTime', moment(hoursToday.close.time, 'HH').format('LT'))
				}
			}
		})
	}
});

module.exports = ResultModel;