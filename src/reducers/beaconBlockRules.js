import { List, Map } from 'immutable';

import { ADD_NEW_BEACON } from '../actions/beacons';

const initalState = List([
  Map({
    name: 'Testing Beacon',
    uuid: '20688:13234',
    region: 'blue',
    floor: 7,
    blocks: List([]),
  }),
  Map({
    name: 'Beacon #2',
    uuid: '54351:29236',
    region: 'red',
    floor: 7,
    blocks: List([]),
  }),
]);

const beaconBlockRules = (state = initalState, action) => {
  switch (action) {
    case ADD_NEW_BEACON: {
      return state.push(action.newBeacon);
    }

    default: {
      return state;
    }
  }
};

export default beaconBlockRules;
