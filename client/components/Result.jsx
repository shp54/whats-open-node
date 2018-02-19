const { h } = require('hyperapp');
const ConditionalLink = require('./ConditionalLink.jsx');
const getClosingTime = require('../selectors');

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
