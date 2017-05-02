// @flow
import { List, Map } from 'immutable';

import { UPDATE_BEACON_UUID, UPDATE_BEACON, DELETE_BEACON, Beacon } from '../actions/beacons';
import type { BeaconType } from '../actions/beacons';

const initalState = {
  allBeacons: Map({
    '20688:13234': Beacon({
      name: 'Testing Beacon',
      uuid: '20688:13234',
      region: 'blue',
      floor: '7',
      blocks: List([]),
    }),
    '54351:29236': Beacon({
      name: 'Beacon #2',
      uuid: '54351:29236',
      region: 'red',
      floor: '7',
      blocks: List([]),
    }),
  }),
  regionsByFloor: Map({
    7: Map({
      // TODO: This should store the beacons not just the UUIDs
      red: List(['54351:29236']),
      blue: List(['20688:13234']),
    }),
  }),
};
export type BeaconStateType = typeof initalState;
export type allBeaconsType = typeof initalState.allBeacons;
export type RegionsByFloorType = typeof initalState.regionsByFloor;

function generateRegionsByFloor(allBeacons: allBeaconsType): RegionsByFloorType {
  let regionsByFloor = Map({});

  allBeacons.forEach((beacon: BeaconType, key) => {
    // Set Floors
    if (!regionsByFloor.has(beacon.floor)) {
      regionsByFloor = regionsByFloor.set(beacon.floor, Map({}));
    }

    // Set Regions
    const regions = regionsByFloor.get(beacon.floor);
    if (!regions.has(beacon.region)) {
      regionsByFloor = regionsByFloor.setIn([beacon.floor, beacon.region], List([]));
    }

    // Set Beacons
    let beacons = regionsByFloor.getIn([beacon.floor, beacon.region]);
    if (!beacons.includes(beacon.uuid)) {
      beacons = beacons.push(beacon.uuid);
      regionsByFloor = regionsByFloor.setIn([beacon.floor, beacon.region], beacons);
    }
  });

  return regionsByFloor;
}

const beacons = (state = initalState, action) => {
  switch (action.type) {
    case UPDATE_BEACON: {
      const newAllBeacons = state.allBeacons.set(action.beacon.uuid, action.beacon);
      const newRegionsByFloor = generateRegionsByFloor(newAllBeacons);

      return {
        allBeacons: newAllBeacons,
        regionsByFloor: newRegionsByFloor,
      };
    }

    case UPDATE_BEACON_UUID: {
      let newAllBeacons = state.allBeacons.delete(action.oldUuid);
      newAllBeacons = newAllBeacons.set(action.beacon.uuid, action.beacon);
      const newRegionsByFloor = generateRegionsByFloor(newAllBeacons);

      return {
        allBeacons: newAllBeacons,
        regionsByFloor: newRegionsByFloor,
      };
    }

    case DELETE_BEACON: {
      const newAllBeacons = state.allBeacons.delete(action.uuid);
      const newRegionsByFloor = generateRegionsByFloor(newAllBeacons);

      return {
        allBeacons: newAllBeacons,
        regionsByFloor: newRegionsByFloor,
      };
    }

    default: {
      return state;
    }
  }
};

export default beacons;
