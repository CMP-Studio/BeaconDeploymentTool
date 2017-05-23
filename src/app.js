import React from 'react';
import { Provider } from 'react-redux';

import configureStore from './store';

import WayfindingActor from './actors/wayfindingActor';

import RootScreen from './containers/rootScreen';

const store = configureStore();

import { loadBeaconsFromFile } from './actions/data';
store.dispatch(loadBeaconsFromFile('test'));

const App = () => {
  const wayfindingActor = new WayfindingActor(store);

  return (
    <Provider store={store}>
      <RootScreen />
    </Provider>
  );
};

import { detectedBeacons } from './actions/wayfinding';
const beacons = ['22316:10343', '33169:65340', '4802:60189'];
store.dispatch(detectedBeacons(beacons));

export default App;
