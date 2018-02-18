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
  setLocation: ({ latitude, longitude }) => ({ latitude, longitude }),
  setNextPageToken: (nextPageToken) => ({ nextPageToken }),
  setLoading: isLoading => ({ isLoading }),
  addResult: result => (state, actions) => ({ results: Object.assign(state.results, { [result.place_id]: result }) }),
  fetchPlace: place_id => (state, actions) => {
    fetch(`/place/${place_id}`)
      .then(res => res.json())
      .then(data => actions.addResult(data.result)); // addResult can smart update the entire state
  },
  updatePlaces: () => (state, actions) => {
    Object.keys(state.results).forEach(actions.fetchPlace);
  },
  fetchPlaceList:  (url) => (state, actions) => {
    !state.loading && actions.setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        actions.setLoading(false);
        actions.setNextPageToken(data.next_page_token);
        data.results.forEach(result => {
          actions.addResult(result); // rendering is cheap with vdom - let's go nuts
          actions.fetchPlace(result.place_id); // fetch detailed model for each place - Google fetches partial model from list endpoint
        });
      });
  },
  fetchList: () => (state, actions) => {
    !state.loading && actions.setLoading(true);
    actions.fetchPlaceList(`/open?lat=${state.latitude}&long=${state.longitude}`);
  },
  fetchNext: () => (state, actions) => {
    !state.loading && actions.setLoading(true);
    if (state.nextPageToken) {
      actions.fetchPlaceList(`/open?pagetoken=${state.nextPageToken}`);
    }
  },
};

const view = (state, actions) => (
  <div>
    <h3>Ranked by distance</h3>
    <ul class='list-group'>
      {Object.values(state.results).map(result => <Result place={result} />)}
      {state.isLoading && <img src={spinner} height='160' width='160' class='spinner-gif' /> }
    </ul>
  </div>
);

const main = app(state, actions, view, document.getElementById('app'));

geoPosition.init();
geoPosition.getCurrentPosition(p => {
  main.setLocation(p.coords);
  main.fetchList();
  setTimeout(main.updatePlaces, 60000);
}, p => console.log('Error :('));
// TODO need to give a nicer UX - Dispatch an action that sets an error prop on the state?


window.addEventListener("scroll", function() { 
  if (window.scrollY + window.innerHeight >= document.documentElement.offsetHeight) {
    main.fetchNext();
  }
});