let _ = require('underscore'),
	moment = require('moment')

//This module is used to decorate the JSON returned by the result module (cleans up model details)
let ResultDecorator = {
	initialize(data){
		this.data = data
		return this
	},
	getPlaceUrl(){
		if(this.data.result){ //Model doesn't have API results right away, so you have to check if it's complete
			return this.data.result.url
		} else {
			return ""
		}
	},
	getHoursForWeekday(periods, weekday){
		if(periods.length == 1){ //if there's just one period, return the one they got
			return periods[0]
		} else { //otherwise find the one for the current weekday
			return _.find(periods, (p) => p.open.day == weekday)
		}
	},
	getOpeningHours(){
		if(this.data.result && this.data.result.opening_hours){ //Get opening hours for current weekday
			let result = this.data.result
			let currentWeekday = moment().day()
			let hoursToday = this.getHoursForWeekday(result.opening_hours.periods, currentWeekday)
			if(hoursToday.close){
				return moment(hoursToday.close.time, 'HH').format('LT')
			}
		} else {
			return ""
		}
	},
	decorate(){
		let decs = {};
		
		decs.placeUrl = this.getPlaceUrl();
		decs.closingTime = this.getOpeningHours();
		
		return _.extend(this.data, decs)
	}
}

module.exports = ResultDecorator