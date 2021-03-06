import { NativeModules } from 'react-native';

import { Map, List, Set } from 'immutable';

import { generateRegionsByFloor } from '../utilities';

const BeaconManager = NativeModules.CMSBeaconManager;

// *** Action Types ***
export const UPDATE_WAYFINDING_STATUS = 'UPDATE_WAYFINDING_STATUS';
export const REQUEST_LOCATION_SERVICES_AUTHORIZATION = 'REQUEST_LOCATION_SERVICES_AUTHORIZATION';

export const START_SCANNING_FAILURE = 'START_SCANNING_FAILURE';
export const START_SCANNING_SUCCESS = 'START_SCANNING_SUCCESS';

export const DETECTED_BEACONS = 'DETECTED_BEACONS';

export const SWITCH_BEACON_SHOW_TYPE = 'SWITCH_BEACON_SHOW_TYPE';
export const DETECTED_BEACONS_TYPE = 'DETECTED_BEACONS_TYPE';
export const UNKNOWN_BEACONS_TYPE = 'UNKNOWN_BEACONS_TYPE';

// *** Location Services Types ***
export const LOCATION_SERVICES_STATUS_NOTDETERMINED = 'LOCATION_SERVICES_STATUS_NOTDETERMINED';
export const LOCATION_SERVICES_STATUS_DENIED = 'LOCATION_SERVICES_STATUS_DENIED';
export const LOCATION_SERVICES_STATUS_AUTHORIZED = 'LOCATION_SERVICES_STATUS_AUTHORIZED';

// *** Actions Creators ***
export function requestLocationServicesAuthorization() {
  BeaconManager.requestLocationServicesAuthorization();

  return {
    type: REQUEST_LOCATION_SERVICES_AUTHORIZATION,
  };
}

export function switchBeaconShowType(showBeaconsType) {
  return {
    type: SWITCH_BEACON_SHOW_TYPE,
    showBeaconsType,
  };
}

export function updateWayfindingStatus(bluetoothOn, locationServicesStatus) {
  return {
    bluetoothOn,
    locationServicesStatus,
    type: UPDATE_WAYFINDING_STATUS,
  };
}

export function startScanningSuccessful(rangingUUID, rangingIdentifier) {
  return {
    type: START_SCANNING_SUCCESS,
    rangingUUID,
    rangingIdentifier,
  };
}

export function startScanningFailure(error) {
  return {
    type: START_SCANNING_FAILURE,
  };
}

export function detectedBeacons(beacons) {
  return (dispatch, getState) => {
    const allDetectedBeacons = beacons;
    const allBeacons = getState().beacons.allBeacons;
    const prevFloor = getState().detected.detectedFloor;
    const previousRegions = getState().detected.previousRegions;

    let knownBeacons = Map();
    let unknownBeacons = List();

    // 1. Find known and unknown beacons
    for (const beacon of allDetectedBeacons) {
      if (allBeacons.has(beacon)) {
        knownBeacons = knownBeacons.set(beacon, allBeacons.get(beacon));
      } else {
        unknownBeacons = unknownBeacons.push(beacon);
      }
    }

    // 2. Build detectedBeaconsByRegions map
    const regionsByFloor = generateRegionsByFloor(knownBeacons);

    // 3. Build blockedBy map
    let allBlocks = Set();
    let blockedBy = Map();
    for (const beacon of knownBeacons.values()) {
      allBlocks = allBlocks.union(beacon.blocks.toSet());

      beacon.blocks.forEach((block) => {
        if (!blockedBy.has(block)) {
          blockedBy = blockedBy.set(block, Set([beacon.name]));
        } else {
          let updatedBlocks = blockedBy.get(block);
          updatedBlocks = updatedBlocks.add([beacon.name]);
          blockedBy = blockedBy.set(block, updatedBlocks);
        }
      });
    }

    // 4. Find unblocked beacons
    const filteredBeacon = knownBeacons.filter((beacon) => {
      return !allBlocks.has(beacon.uuid);
    });

    // 5. Detected floor and regions
    let allRegions = Set();
    let allFloors = Set();
    let detectedFloor = prevFloor;
    for (const beacon of filteredBeacon.values()) {
      if (beacon.region !== '') {
        allRegions = allRegions.add(beacon.region);
      }

      if (beacon.floor !== '') {
        allFloors = allFloors.add(beacon.floor);
      }
    }

    // Only update floor if unanimous
    if (allFloors.size === 1) {
      detectedFloor = allFloors.first();
    }

    // Only add region if detected twice in a row
    let newRegions = Set();
    if (previousRegions.size === 0) {
      newRegions = allRegions;
    } else {
      newRegions = allRegions.intersect(previousRegions);
    }

    dispatch({
      type: DETECTED_BEACONS,
      detectedFloor,
      detectedRegions: newRegions.toList(),
      previousRegions: allRegions.toList(),
      blockedBy,
      regionsByFloor,
      unknownBeacons,
      knownBeacons,
    });
  };
}
