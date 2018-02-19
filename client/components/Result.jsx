const { h } = require('hyperapp');
const moment = require('moment');
const createCachedSelector = require('re-reselect').default;
const ConditionalLink = require('./ConditionalLink.jsx');

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
