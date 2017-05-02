// @flow
import { List, Map } from 'immutable';

import { RECREATE_BEACON, UPDATE_BEACON, DELETE_BEACON, Beacon } from '../actions/beacons';
import type { BeaconType } from '../actions/beacons';

// Merely for testing...
const testBeaconBlue = Beacon({
  name: 'Testing Beacon',
  uuid: '20688:13234',
  floor: '7',
  regions: List(['blue', 'red']),
  blocks: List(),
});
const testBeaconRed = Beacon({
  name: 'Beacon #2',
  uuid: '54351:29236',
  floor: '7',
  regions: List(['red']),
  blocks: List(),
});
// End testing

const initalState = {
  allBeacons: Map({
    '20688:13234': testBeaconBlue,
    '54351:29236': testBeaconRed,
  }),
  regionsByFloor: Map({
    7: Map({
      red: List([testBeaconRed, testBeaconBlue]),
      blue: List([testBeaconBlue]),
    }),
  }),
};
export type BeaconStateType = typeof initalState;
export type allBeaconsType = typeof initalState.allBeacons;
export type RegionsByFloorType = typeof initalState.regionsByFloor;

function generateRegionsByFloor(allBeacons: allBeaconsType): RegionsByFloorType {
  let regionsByFloor = Map({});

  const setRegions = (beacon, region, regionsByFloorArg) => {
    let regionsByFloorCopy = regionsByFloorArg;
    const regions = regionsByFloorCopy.get(beacon.floor);

    if (!regions.has(region)) {
      regionsByFloorCopy = regionsByFloorCopy.setIn([beacon.floor, region], List([]));
    }

    // Set Beacons
    let beacons = regionsByFloorCopy.getIn([beacon.floor, region]);
    if (!beacons.includes(beacon)) {
      beacons = beacons.push(beacon);
      regionsByFloorCopy = regionsByFloorCopy.setIn([beacon.floor, region], beacons);
    }

    return regionsByFloorCopy;
  };

  allBeacons.forEach((beacon: BeaconType, key) => {
    // Set Floors
    if (!regionsByFloor.has(beacon.floor)) {
      regionsByFloor = regionsByFloor.set(beacon.floor, Map({}));
    }

    // Set Regions
    if (beacon.regions.size === 0) {
      regionsByFloor = setRegions(beacon, 'Unassigned', regionsByFloor);
    } else {
      beacon.regions.forEach((region: string) => {
        regionsByFloor = setRegions(beacon, region, regionsByFloor);
      });
    }
  });

  return regionsByFloor;
}

const beacons = (state = initalState, action) => {
  switch (action.type) {
    case UPDATE_BEACON: {
      const newAllBeacons = state.allBeacons.set(action.beacon.uuid, action.beacon);
      const newRegionsByFloor = generateRegionsByFloor(newAllBeacons);

      console.log(newRegionsByFloor);

      return {
        allBeacons: newAllBeacons,
        regionsByFloor: newRegionsByFloor,
      };
    }

    case RECREATE_BEACON: {
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
