// @flow
import { List, Map } from 'immutable';

import { generateRegionsByFloor } from '../utilities';

import { RECREATE_BEACON, UPDATE_BEACON, DELETE_BEACON, Beacon } from '../actions/beacons';
import type { BeaconType, BeaconIDType } from '../actions/beacons';

// Merely for testing...
const testBeaconOne = Beacon({
  name: 'Beacon #1',
  uuid: '22316:10343',
  floor: '7',
  regions: List(['blue', 'red']),
  blocks: List(['33169:65340', '3']),
});
const testBeaconTwo = Beacon({
  name: 'Beacon #2',
  uuid: '33169:65340',
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
    '22316:10343': testBeaconOne,
    '33169:65340': testBeaconTwo,
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
