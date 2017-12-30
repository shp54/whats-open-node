const { h, app } = require('hyperapp');
const geoPosition = require('../lib/geoPosition');
const Result = require('./components/Result.jsx');
const spinner = require('./images/spinner.gif');

require("./styles/bootstrap.css"); // Using custom version of bootstrap w/o fonts, should probably restyle using semantic-ui (I like it more)
require("./styles/main.css")

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
    state.isLoading ?
      <img src={spinner} height='160' width='160' class='spinner-gif' /> :
      (<div>
        <h3>Ranked by distance</h3>
        <ul class='list-group'>
          {state.results.map(result => <Result place={result} />)}
        </ul>
      </div>)
);

const main = app(state, actions, view, document.getElementById('app'));

geoPosition.init();
geoPosition.getCurrentPosition(p => {
  main.setLocation(p.coords);
  main.fetchData();
  setTimeout(main.fetchData, 60000);
}, p => console.log('Error :('));
// TODO need to give a nicer UX - Dispatch an action that sets an error prop on the state?
