import { List, Map } from 'immutable';

import {
  DETECTED_BEACONS,
  DETECTED_BEACONS_TYPE,
  SWITCH_BEACON_SHOW_TYPE,
} from '../actions/wayfinding';

const initalState = {
  detectedFloor: null,
  detectedRegions: List(),
  previousRegions: List(),
  blockedBy: Map(),
  regionsByFloor: Map(),
  unknownBeacons: List(),
  knownBeacons: List(),
  showBeaconsType: DETECTED_BEACONS_TYPE,
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
        knownBeacons,
      } = action;

      return Object.assign({}, state, {
        detectedFloor,
        detectedRegions,
        previousRegions,
        blockedBy,
        regionsByFloor,
        unknownBeacons,
        knownBeacons,
      });
    }

    case SWITCH_BEACON_SHOW_TYPE: {
      const { showBeaconsType } = action;

      return Object.assign({}, state, {
        showBeaconsType,
      });
    }

    default: {
      return state;
    }
  }
};

export default detected;
