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
 results: {},
};

const actions = {
  setLocation: ({ latitude, longitude }) => (state, actions) => ({ latitude, longitude }),
  setLoading: isLoading => (state, actions) => ({ isLoading }),
  addResult: result => (state, actions) => ({ results: Object.assign(state.results, { [result.place_id]: result }) }),
  fetchPlace: place_id => (state, actions) => {
    fetch(`/place/${place_id}`)
      .then(res => res.json())
      .then(data => actions.addResult(data.result)); // addResult can smart update the entire state
  },
  fetchList: () => (state, actions) => {
    fetch(`/open?lat=${state.latitude}&long=${state.longitude}`)
      .then(res => res.json())
      .then(data => {
        actions.setLoading(false);
        data.results.forEach(result => {
          actions.addResult(result); // rendering is cheap with vdom - let's go nuts
          actions.fetchPlace(result.place_id); // fetch details for each place
        });
      });
  },
};

const view = (state, actions) => (
    state.isLoading ?
      <img src={spinner} height='160' width='160' class='spinner-gif' /> :
      (<div>
        <h3>Ranked by distance</h3>
        <ul class='list-group'>
          {Object.values(state.results).map(result => <Result place={result} />)}
        </ul>
      </div>)
);

const main = app(state, actions, view, document.getElementById('app'));

geoPosition.init();
geoPosition.getCurrentPosition(p => {
  main.setLocation(p.coords);
  main.fetchList();
  setTimeout(main.fetchList, 60000);
}, p => console.log('Error :('));
// TODO need to give a nicer UX - Dispatch an action that sets an error prop on the state?
