let _ = require('underscore'),
	moment = require('moment')

//This module is used to decorate the JSON returned by the result module (cleans up model details)
let ResultDecorator = {
	getHoursForWeekday(periods, weekday){
		if(periods.length == 1){ //if there's just one period, return the one they got
			return periods[0]
		} else { //otherwise find the one for the current weekday
			return _.find(periods, (p) => p.open.day == weekday)
		}
	},
	decorate(data){
		let decs = {};
		if(data.result){ //Model doesn't have API results right away, so you have to check if it's complete
			let result = data.result
			decs.placeUrl = result.url; //Get maps URL
			if(data.result.opening_hours){ //Get opening hours for current weekday
				let currentWeekday = moment().day()
				let hoursToday = this.getHoursForWeekday(result.opening_hours.periods, currentWeekday)
				if(hoursToday.close){
					decs.closingTime = moment(hoursToday.close.time, 'HH').format('LT')
				}
			}
		}
		
		return _.extend(data, decs)
	}
}

module.exports = ResultDecorator