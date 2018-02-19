const { app } = require('hyperapp');
const geoPosition = require('../lib/geoPosition');
const actions = require('./actions');
const view = require('./view');

const state = {
  isLoading: true,
  latitude: null,
  longitude: null,
  results: {},
};

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