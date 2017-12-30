const { h, app } = require('hyperapp');
const geoPosition = require('../lib/geoPosition');
const Result = require('./components/Result.jsx');

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
