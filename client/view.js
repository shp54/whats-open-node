const { h } = require('hyperapp');
const Result = require('./components/Result.jsx');
const spinner = require('./images/spinner.gif');

require("./styles/bootstrap.css"); // Using custom version of bootstrap w/o fonts, should probably restyle using semantic-ui (I like it more)
require("./styles/main.css")

const view = (state, actions) => (
  <div>
    <h3>Ranked by distance</h3>
    <ul class='list-group'>
      {Object.values(state.results).map(result => <Result place={result} key={result.place_id} />)}
      {state.isLoading && <img src={spinner} height='160' width='160' class='spinner-gif' /> }
    </ul>
  </div>
);

module.exports = view;