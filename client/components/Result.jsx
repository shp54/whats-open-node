const { h } = require('hyperapp');

const Result = ({ place }) => (
  <li class='list-group-item'>
  {place.placeUrl ?
    <a href={place.placeUrl} target='_blank'><h3>{place.name}</h3></a>
  	: <h3>{place.name}</h3>}
    <span class='address'>{place.vicinity}</span>
    {place.closingTime ? <div class='closingTime'>Open until {place.closingTime} today</div> : null}
    {/*<img src={place.icon} alt={place.types[0]} title={place.types[0]} class='icon' width='53' height='53' />*/}
  </li>
);

module.exports = Result;
