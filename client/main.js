const { h, app } = require('hyperapp');
const geoPosition = require('../lib/geoPosition');

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

const view = (state, actions) => h("div", {}, [
  h("div", {}, [
   state.isLoading ? h("img", {src: 'images/spinner.gif'}) : null
  ]),
  h("div", {}, JSON.stringify(state.results)),
]);

const main = app(state, actions, view, document.body);

geoPosition.init();
geoPosition.getCurrentPosition(p => {
  main.setLocation(p.coords);
  main.fetchData();
}, p => console.log('Error :('));
