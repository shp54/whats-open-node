let Backbone = require('backbone'),
	$ = require('jquery'),
	_ = require('underscore'),
	moment = require('moment')

let ResultModel = Backbone.Model.extend({
	idAttribute: "place_id",
	url(){
		return `/place/${this.id}`
	},
	getHoursForWeekday(periods, weekday){
		if(periods.length == 1){ //if there's just one period, return the one they got
			return periods[0]
		} else { //otherwise find the one for the current weekday
			return _.find(periods, (p) => p.open.day == weekday)
		}
	},
	initialize(){ 
		/*$.get(this.url()).then((data) => { //Get closing time and other info
			let result = data.result
			if(result && result.opening_hours){
				let currentWeekday = moment().day()
				let hoursToday = this.getHoursForWeekday(result.opening_hours.periods, currentWeekday)
				if(hoursToday.close){
					this.set('closingTime', moment(hoursToday.close.time, 'HH').format('LT'))
				}
			}
			this.set('placeUrl', result.url)
		})*/
		this.fetch()
	},
	toJSON(){
		let data = _.clone(this.attributes)
		
		//Decorate the default JSON with extra data
		let decs = {};
		if(data.result){
			decs.placeUrl = data.result.url;
			if(data.result.opening_hours){
				let currentWeekday = moment().day()
				let hoursToday = this.getHoursForWeekday(data.result.opening_hours.periods, currentWeekday)
				if(hoursToday.close){
					decs.closingTime = moment(hoursToday.close.time, 'HH').format('LT')
				}
			}
		}
		
		let json = _.extend(data, decs)
		return json
	}
});

module.exports = ResultModel;