type BeaconID = string;

type BeaconType = {
  name: string,
  uuid: BeaconID,
  region: string,
  floor: number,
  blocks: Array<BeaconID>,
};

export const ADD_NEW_BEACON = 'ADD_NEW_BEACON';

export function addNewBeacon(newBeacon: BeaconType): void {
  return {
    type: ADD_NEW_BEACON,
    newBeacon,
  };
}
export type AddNewBeaconType = typeof addNewBeacon;
