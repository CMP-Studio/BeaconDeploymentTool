// @flow
import { Map } from 'immutable';

import { generateRegionsByFloor } from '../utilities';

import { LOAD_BEACONS_FROM_FILE } from '../actions/data';

import { RECREATE_BEACON, UPDATE_BEACON, DELETE_BEACON } from '../actions/beacons';
import type { BeaconType, BeaconIDType } from '../actions/beacons';

const initalState = {
  allBeacons: Map(),
  regionsByFloor: Map(),
};

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
    case LOAD_BEACONS_FROM_FILE: {
      const { allBeacons } = action;
      const regionsByFloor = generateRegionsByFloor(allBeacons);

      return {
        allBeacons,
        regionsByFloor,
      };
    }

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
