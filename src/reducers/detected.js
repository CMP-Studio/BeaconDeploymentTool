import { List, Map } from 'immutable';

import { DETECTED_BEACONS } from '../actions/wayfinding';

const initalState = {
  detectedFloor: null,
  detectedRegions: List(),
  previousRegions: List(),
  blockedBy: Map(),
  detectedBeaconsByRegions: Map(),
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
        allDetectedBeaconsByRegions,
        unknownBeacons,
      } = action;

      return Object.assign({}, state, {
        detectedFloor,
        detectedRegions,
        previousRegions,
        blockedBy,
        allDetectedBeaconsByRegions,
        unknownBeacons,
      });
    }

    default: {
      return state;
    }
  }
};

export default detected;
