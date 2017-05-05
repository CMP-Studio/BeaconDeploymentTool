// @flow
import { List, Map } from 'immutable';

import { RECREATE_BEACON, UPDATE_BEACON, DELETE_BEACON, Beacon } from '../actions/beacons';
import type { BeaconType, BeaconIDType } from '../actions/beacons';

// Merely for testing...
const testBeaconOne = Beacon({
  name: 'Beacon #1',
  uuid: '1',
  floor: '7',
  regions: List(['blue', 'red']),
  blocks: List(['2']),
});
const testBeaconTwo = Beacon({
  name: 'Beacon #2',
  uuid: '2',
  floor: '7',
  regions: List(['red', 'gray']),
  blocks: List(['3']),
});
const testBeaconThree = Beacon({
  name: 'Beacon #3',
  uuid: '3',
  floor: '7',
  regions: List(),
  blocks: List(['4']),
});
const testBeaconFour = Beacon({
  name: 'Beacon #4',
  uuid: '4',
  floor: '6',
  regions: List(['gray']),
  blocks: List(),
});

const initalState = {
  allBeacons: Map({
    1: testBeaconOne,
    2: testBeaconTwo,
    3: testBeaconThree,
    4: testBeaconFour,
  }),
  regionsByFloor: Map(),
};
initalState.regionsByFloor = generateRegionsByFloor(initalState.allBeacons);
// End testing

export type BeaconStateType = typeof initalState;
export type AllBeaconsType = typeof initalState.allBeacons;
export type RegionsByFloorType = typeof initalState.regionsByFloor;

function generateRegionsByFloor(allBeacons: AllBeaconsType): RegionsByFloorType {
  let regionsByFloor = Map({});

  const setRegions = (beacon, region, regionsByFloorArg) => {
    let newRegionsByFloor = regionsByFloorArg;
    const regions = newRegionsByFloor.get(beacon.floor);

    if (!regions.has(region)) {
      newRegionsByFloor = newRegionsByFloor.setIn([beacon.floor, region], List([]));
    }

    // Set Beacons
    let beacons = newRegionsByFloor.getIn([beacon.floor, region]);
    if (!beacons.includes(beacon)) {
      beacons = beacons.push(beacon);
      newRegionsByFloor = newRegionsByFloor.setIn([beacon.floor, region], beacons);
    }

    return newRegionsByFloor;
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

function updateUUIDFromEveryBlocks(
  allBeacons: AllBeaconsType,
  uuid: BeaconIDType,
  newUUID: ?BeaconIDType,
): AllBeaconsType {
  let newAllBeacons = allBeacons;

  allBeacons.forEach((beacon: BeaconType, key) => {
    const foundIndex = beacon.blocks.indexOf(uuid);
    if (foundIndex !== -1) {
      let newBlocks;

      if (newUUID) {
        newBlocks = beacon.blocks.set(foundIndex, newUUID);
      } else {
        newBlocks = beacon.blocks.delete(foundIndex);
      }

      newAllBeacons = newAllBeacons.setIn([beacon.uuid, 'blocks'], newBlocks);
    }
  });

  return newAllBeacons;
}

const beacons = (state: BeaconStateType = initalState, action: any) => {
  switch (action.type) {
    case UPDATE_BEACON: {
      const newAllBeacons = state.allBeacons.set(action.beacon.uuid, action.beacon);
      const newRegionsByFloor = generateRegionsByFloor(newAllBeacons);

      return {
        allBeacons: newAllBeacons,
        regionsByFloor: newRegionsByFloor,
      };
    }

    case RECREATE_BEACON: {
      let newAllBeacons = state.allBeacons.delete(action.oldUuid);
      newAllBeacons = newAllBeacons.set(action.beacon.uuid, action.beacon);
      newAllBeacons = updateUUIDFromEveryBlocks(newAllBeacons, action.oldUuid, action.beacon.uuid);
      const newRegionsByFloor = generateRegionsByFloor(newAllBeacons);

      return {
        allBeacons: newAllBeacons,
        regionsByFloor: newRegionsByFloor,
      };
    }

    case DELETE_BEACON: {
      let newAllBeacons = state.allBeacons.delete(action.uuid);
      newAllBeacons = updateUUIDFromEveryBlocks(newAllBeacons, action.uuid);
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
