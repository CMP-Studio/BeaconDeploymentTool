type BeaconID = string;

type Beacon = {
  name: string,
  uuid: BeaconID,
  region: string,
  floor: number,
  blocks: Array<BeaconID>,
};

export const ADD_NEW_BEACON = 'ADD_NEW_BEACON';

export function addNewBeacon(newBeacon: Beacon) {
  return {
    type: ADD_NEW_BEACON,
    newBeacon,
  };
}
