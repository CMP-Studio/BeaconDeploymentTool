import { List } from 'immutable';

import { ADD_NEW_BEACON, Beacon } from '../actions/beacons';

const initalState = List([
  Beacon({
    name: 'Testing Beacon',
    uuid: '20688:13234',
    region: 'blue',
    floor: 7,
    blocks: List([]),
  }),
  Beacon({
    name: 'Beacon #2',
    uuid: '54351:29236',
    region: 'red',
    floor: 7,
    blocks: List([]),
  }),
]);

const beaconBlockRules = (state = initalState, action) => {
  switch (action.type) {
    case ADD_NEW_BEACON: {
      return state.push(action.newBeacon);
    }

    default: {
      return state;
    }
  }
};

export default beaconBlockRules;
