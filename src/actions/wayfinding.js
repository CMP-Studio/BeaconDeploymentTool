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
    const detectedBeaconsByRegions = generateRegionsByFloor(knownBeacons);

    // 3. Build blockedBy map
    let allBlocks = Set();
    let blockedBy = Map();
    for (const beacon of knownBeacons.values()) {
      allBlocks = allBlocks.union(beacon.blocks.toSet());

      beacon.blocks.forEach((block) => {
        if (!blockedBy.has(block)) {
          blockedBy = blockedBy.set(block, List([beacon.uuid]));
        } else {
          let updatedBlocks = blockedBy.get(block);
          updatedBlocks = updatedBlocks.push([beacon.uuid]);
          blockedBy = blockedBy.set(block, updatedBlocks);
        }
      });
    }

    // 4. Find unblocked beacons
    const filteredBeacon = knownBeacons.filter((beacon) => {
      return !allBlocks.has(beacon.uuid);
    });

    // 5. Find detected floor
    // 6. Find  detected regions
    let allRegions = Set();
    let allFloors = Set();
    let detectedFloor = prevFloor;
    for (const beacon of filteredBeacon.values()) {
      allRegions = allRegions.union(beacon.regions.toSet());
      allFloors = allFloors.add(beacon.floor);
    }

    // Only update floor if unanimous
    if (allFloors.size === 1) {
      detectedFloor = allFloors.first();
    }

    dispatch({
      type: DETECTED_BEACONS,
      detectedFloor,
      detectedRegions: allRegions.toList(),
      blockedBy,
      detectedBeaconsByRegions,
      unknownBeacons,
    });
  };
}
