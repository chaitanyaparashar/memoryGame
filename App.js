import React, {Component} from 'react';
import {Provider} from 'react-redux';

import store from './store';
import Home from './Home';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }
}
