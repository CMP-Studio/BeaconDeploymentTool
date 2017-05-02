// @flow
import { NavigationActions } from 'react-navigation';

import { List, Record } from 'immutable';

export const Beacon = Record({
  name: '',
  uuid: '',
  region: '',
  floor: '',
  blocks: List([]),
});
export type BeaconType = typeof Beacon;
export type BeaconIDType = string;

type UpdateBeaconActionType = 'UPDATE_BEACON';
export const UPDATE_BEACON: UpdateBeaconActionType = 'UPDATE_BEACON';

type UpdateBeaconUUIDActionType = 'UPDATE_BEACON_UUID';
export const UPDATE_BEACON_UUID: UpdateBeaconUUIDActionType = 'UPDATE_BEACON_UUID';

type DeleteBeaconActionType = 'DELETE_BEACON';
export const DELETE_BEACON: DeleteBeaconActionType = 'DELETE_BEACON';

type Action =
  | { type: UpdateBeaconActionType, beacon: BeaconType }
  | { type: UpdateBeaconUUIDActionType, beacon: BeaconType, oldUuid: string }
  | { type: DeleteBeaconActionType, uuid: string }
  | { type: 'Navigation/BACK', key: ?string };

/* eslint-disable no-use-before-define */
type GetState = () => Object;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
/* eslint-enable no-use-before-define */

export function updateBeacon(beacon: BeaconType) {
  return {
    type: UPDATE_BEACON,
    beacon,
  };
}
export type UpdateBeaconType = typeof updateBeacon;

export function addNewBeacon(beacon: BeaconType): ThunkAction {
  return (dispatch, getState) => {
    dispatch(updateBeacon(beacon));

    dispatch(NavigationActions.back());
  };
}
export type AddNewBeaconType = typeof addNewBeacon;

export function updateBeaconUuid(beacon: BeaconType, oldUuid: BeaconIDType) {
  return {
    type: UPDATE_BEACON_UUID,
    beacon,
    oldUuid,
  };
}
export type UpdateBeaconUuidType = typeof updateBeaconUuid;

function deleteBeaconAction(uuid: BeaconIDType) {
  return {
    type: DELETE_BEACON,
    uuid,
  };
}

export function deleteBeacon(uuid: BeaconIDType): ThunkAction {
  return (dispatch, getState) => {
    dispatch(deleteBeaconAction(uuid));

    dispatch(NavigationActions.back());
  };
}
export type DeleteBeaconType = typeof deleteBeacon;
