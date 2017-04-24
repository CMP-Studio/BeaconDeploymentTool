// @flow
import { NavigationActions } from 'react-navigation';

import { List, Record } from 'immutable';
import type { List as ListType, Record as RecordType } from 'immutable';

type BeaconID = string;

type InternalBeaconType = {
  name: string,
  uuid: BeaconID,
  region: string,
  floor: number,
  blocks: ListType<BeaconID>,
};

export type BeaconType = InternalBeaconType & RecordType<InternalBeaconType>;
export const Beacon: BeaconType = Record({
  name: '',
  uuid: '',
  region: '',
  floor: 0,
  blocks: List([]),
});

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
