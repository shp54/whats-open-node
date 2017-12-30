const { h } = require('hyperapp');
const moment = require('moment');
const ConditionalLink = require('./ConditionalLink.jsx');

// if there's just one period, return the one they got
// otherwise find the one for the current weekday
const getHoursForWeekday = (periods, weekday) => {
  return periods.length > 1 ?
    periods.filter(p => p.open.day === weekday)[0] :
    periods[0];
};

// Could use reselect selector for this?
const getClosingTime = (place) => {
    const currentWeekday = moment().day();
    const hoursToday = getHoursForWeekday(place.opening_hours.periods || [], currentWeekday);
    return hoursToday && hoursToday.close ? moment(hoursToday.close.time, 'HH').format('LT') : '';
};

const Result = ({ place }) => (
  <li class='list-group-item'>
    <img src={place.icon} alt={place.types[0]} title={place.types[0]} class='icon' width='53' height='53' />
    <ConditionalLink url={place.url}>
      <h3>{place.name}</h3>
    </ConditionalLink>
    <span class='address'>{place.vicinity}</span>
    {place.opening_hours ? <div class='closingTime'>Open until {getClosingTime(place)} today</div> : null}
  </li>
);

module.exports = Result;
