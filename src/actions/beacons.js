// @flow
import { NavigationActions } from 'react-navigation';

import { List, Record } from 'immutable';

export const Beacon = Record({
  name: '',
  uuid: '',
  region: '',
  floor: 0,
  blocks: List([]),
});
export type BeaconType = typeof Beacon;

type AddNewBeaconActionType = 'ADD_NEW_BEACON';
export const ADD_NEW_BEACON: AddNewBeaconActionType = 'ADD_NEW_BEACON';

type Action =
  | { type: AddNewBeaconActionType, newBeacon: BeaconType }
  | { type: 'Navigation/BACK', key: ?string };

/* eslint-disable no-use-before-define */
type GetState = () => Object;
type PromiseAction = Promise<Action>;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type Dispatch = (action: Action | ThunkAction | PromiseAction | Array<Action>) => any;
/* eslint-enable no-use-before-define */

export function addNewBeacon(newBeacon: BeaconType): ThunkAction {
  return (dispatch, getState) => {
    dispatch({
      type: ADD_NEW_BEACON,
      newBeacon,
    });

    dispatch(NavigationActions.back());
  };
}
export type AddNewBeaconType = typeof addNewBeacon;
