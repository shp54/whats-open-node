const moment = require('moment');
const createCachedSelector = require('re-reselect').default;

// format hours
const formatHours = hours => hours && hours.close ? moment(hours.close.time, 'HH').format('LT') : '';

// Get periods a place is open from API response
const getPeriods = place => place.opening_hours.periods || [];
const getDay = () => moment().day();
const getHoursForToday = createCachedSelector(
  getPeriods,
  getDay,
  (periods, day) => periods.length > 1 ?
    periods.find(p => p.open.day === day) :
    periods[0]
)(
  (place, periods, day) => place.id + '-' + day,
);

const getClosingTime = createCachedSelector(
  getHoursForToday,	
  formatHours,
)(
  place => place.id,
);

module.exports = getClosingTime;