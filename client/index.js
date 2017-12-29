const { h, app } = require('hyperapp');
const geoPosition = require('../lib/geoPosition');

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

const state = {
 isLoading: true,
 latitude: null,
 longitude: null,
 results: [],
};

const actions = {
  setLoading: isLoading => (state, actions) => ({ isLoading }),
  setLocation: ({ latitude, longitude }) => (state, actions) => ({ latitude, longitude }),
  finishFetch: results => (state, actions) => ({ isLoading: false, results }),
  fetchData: () => (state, actions) => {
    actions.setLoading(true);
    fetch(`/open?lat=${state.latitude}&long=${state.longitude}`)
      .then(res => res.json())
      .then(data => actions.finishFetch(data.results));
  },
};

const view = (state, actions) => (
  <main>
    {state.isLoading ?
      <img src='images/spinner.gif' /> :
      (<ul class='list-group'>
        {state.results.map(result => <Result place={result} />)}
      </ul>)
    }
  </main>
);

const main = app(state, actions, view, document.getElementById('app'));

geoPosition.init();
geoPosition.getCurrentPosition(p => {
  main.setLocation(p.coords);
  main.fetchData();
  setTimeout(main.fetchData, 60000);
}, p => console.log('Error :('));
