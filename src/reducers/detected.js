import { List, Map } from 'immutable';

import { DETECTED_BEACONS } from '../actions/wayfinding';

const initalState = {
  detectedFloor: null,
  detectedRegions: List(),
  previousRegions: List(),
  blockedBy: Map(),
  regionsByFloor: Map(),
  unknownBeacons: List(),
};

const detected = (state = initalState, action) => {
  switch (action.type) {
    case DETECTED_BEACONS: {
      const {
        detectedFloor,
        detectedRegions,
        previousRegions,
        blockedBy,
        regionsByFloor,
        unknownBeacons,
      } = action;

      return Object.assign({}, state, {
        detectedFloor,
        detectedRegions,
        previousRegions,
        blockedBy,
        regionsByFloor,
        unknownBeacons,
      });
    }

    default: {
      return state;
    }
  }
};

export default detected;
