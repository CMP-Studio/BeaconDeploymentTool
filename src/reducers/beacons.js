import { List, Map } from 'immutable';

import { ADD_NEW_BEACON, Beacon } from '../actions/beacons';

const initalState = {
  allBeacons: List([
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
  ]),
  regionsByFloor: Map({
    7: Map({
      red: List(['54351:29236']),
      blue: List(['20688:13234']),
    }),
  }),
};

const beacons = (state = initalState, action) => {
  switch (action.type) {
    case ADD_NEW_BEACON: {
      // TODO: Add it to the regions map
      return {
        allBeacons: state.allBeacons.push(action.newBeacon),
        regionsByFloor: state.regionsByFloor,
      };
    }

    default: {
      return state;
    }
  }
};

export default beacons;
