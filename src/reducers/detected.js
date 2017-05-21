import { List, Map } from 'immutable';

import { DETECTED_BEACONS } from '../actions/wayfinding';

const initalState = {
  detectedFloor: null,
  detectedRegions: List(),
  blockedBy: Map(),
  detectedBeaconsByRegions: Map(),
  unknownBeacons: List(),
  allDetectedBeacons: List(),
};

const detected = (state = initalState, action) => {
  switch (action.type) {
    case DETECTED_BEACONS: {
      const {
        detectedFloor,
        detectedRegions,
        blockedBy,
        allDetectedBeaconsByRegions,
        allDetectedBeacons,
      } = action;

      return Object.assign({}, state, {
        detectedFloor,
        detectedRegions,
        blockedBy,
        allDetectedBeaconsByRegions,
        allDetectedBeacons,
      });
    }

    default: {
      return state;
    }
  }
};

export default detected;
