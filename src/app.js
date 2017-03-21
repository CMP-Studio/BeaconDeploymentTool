
import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './store';

import RootScreen from './containers/rootScreen';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <RootScreen />
  </Provider>
);

export default App;
