// @flow
import { NavigationActions } from 'react-navigation';

import { List, Record } from 'immutable';

import { saveBeaconsToFile } from './data';

export const Beacon = Record({
  name: '',
  uuid: '',
  floor: '',
  regions: List(),
  blocks: List(),
});
export type BeaconType = typeof Beacon;
export type BeaconIDType = string;

type UpdateBeaconActionType = 'UPDATE_BEACON';
export const UPDATE_BEACON: UpdateBeaconActionType = 'UPDATE_BEACON';

type RecreateBeaconActionType = 'RECREATE_BEACON';
export const RECREATE_BEACON: RecreateBeaconActionType = 'RECREATE_BEACON';

type DeleteBeaconActionType = 'DELETE_BEACON';
export const DELETE_BEACON: DeleteBeaconActionType = 'DELETE_BEACON';

type Action =
  | { type: UpdateBeaconActionType, beacon: BeaconType }
  | { type: RecreateBeaconActionType, beacon: BeaconType, oldUuid: string }
  | { type: DeleteBeaconActionType, uuid: string }
  | { type: 'Navigation/BACK', key: ?string };

/* eslint-disable no-use-before-define */
type GetState = () => Object;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
/* eslint-enable no-use-before-define */

function updateBeaconAction(beacon, oldUuid) {
  return {
    type: UPDATE_BEACON,
    beacon,
  };
}

export function updateBeacon(beacon: BeaconType) {
  return (dispatch, getState) => {
    dispatch(updateBeaconAction(beacon));

    // TODO: Save from a selected file name
    dispatch(saveBeaconsToFile('test'));
  };
}
export type UpdateBeaconType = typeof updateBeacon;

function recreateBeaconAction(beacon, oldUuid) {
  return {
    type: RECREATE_BEACON,
    beacon,
    oldUuid,
  };
}

export function recreateBeacon(beacon: BeaconType, oldUuid: BeaconIDType) {
  return (dispatch, getState) => {
    dispatch(recreateBeaconAction(beacon, oldUuid));

    // TODO: Save from a selected file name
    dispatch(saveBeaconsToFile('test'));
  };
}
export type RecreateBeaconType = typeof recreateBeacon;

function deleteBeaconAction(uuid: BeaconIDType) {
  return {
    type: DELETE_BEACON,
    uuid,
  };
}

export function deleteBeacon(uuid: BeaconIDType): ThunkAction {
  return (dispatch, getState) => {
    dispatch(deleteBeaconAction(uuid));

    // TODO: Save from a selected file name
    dispatch(saveBeaconsToFile('test'));

    dispatch(NavigationActions.back());
  };
}
export type DeleteBeaconType = typeof deleteBeacon;
