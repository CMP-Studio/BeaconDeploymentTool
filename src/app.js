import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './store';

import { loadBeaconsFromFile } from './actions/data';

import WayfindingActor from './actors/wayfindingActor';

import RootScreen from './containers/rootScreen';

const store = configureStore();

store.dispatch(loadBeaconsFromFile());

const App = () => {
  const wayfindingActor = new WayfindingActor(store);

  return (
    <Provider store={store}>
      <RootScreen />
    </Provider>
  );
};

export default App;
