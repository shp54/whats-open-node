
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
    Object.keys(state.results).forEach(place_id => actions.fetchPlace(place_id));
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
    actions.fetchPlaceList(`/open?lat=${state.latitude}&long=${state.longitude}`);
  },
  fetchNext: () => (state, actions) => {
    if (state.nextPageToken) {
      actions.fetchPlaceList(`/open?pagetoken=${state.nextPageToken}`);
    }
  },
};

module.exports = actions;