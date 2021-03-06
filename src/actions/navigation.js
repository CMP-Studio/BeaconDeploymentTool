// @flow

import { NavigationActions } from 'react-navigation';
import { List } from 'immutable';

import { Beacon, updateBeacon } from './beacons';

type ScreenDetectType = 'SCREEN_DETECT';
export const SCREEN_DETECT: ScreenDetectType = 'SCREEN_DETECT';

type ScreenBeaconListType = 'SCREEN_BEACON_LIST';
export const SCREEN_BEACON_LIST: ScreenBeaconListType = 'SCREEN_BEACON_LIST';

type ScreenBeaconInfoDetectType = 'SCREEN_BEACON_INFO_DETECT';
export const SCREEN_BEACON_INFO_DETECT: ScreenBeaconInfoDetectType = 'SCREEN_BEACON_INFO_DETECT';

type ScreenBeaconInfoBeaconsType = 'SCREEN_BEACON_INFO_BEACONS';
export const SCREEN_BEACON_INFO_BEACONS: ScreenBeaconInfoBeaconsType = 'SCREEN_BEACON_INFO_BEACONS';

type TabDetectType = 'TAB_DETECT';
export const TAB_DETECT: TabDetectType = 'TAB_DETECT';

type TabBeaconsType = 'TAB_BEACONS';
export const TAB_BEACONS: TabBeaconsType = 'TAB_BEACONS';

export type ScreensType =
  | ScreenDetectType
  | ScreenBeaconListType
  | ScreenBeaconInfoDetectType
  | ScreenBeaconInfoBeaconsType
  | TabDetectType
  | TabBeaconsType;

export function navigateAndCreateBeacon(screenName: ScreensType, props: ?any, uuid): void {
  return (dispatch, getState) => {
    const newBeacon = Beacon({
      uuid,
      name: 'Unnamed',
      floor: 'Unassigned',
      region: '',
      blocks: List(),
    });

    dispatch(updateBeacon(newBeacon));

    dispatch(
      NavigationActions.navigate({
        routeName: screenName,
        params: { ...props },
      }),
    );
  };
}

export function navigate(screenName: ScreensType, props: ?any): void {
  return NavigationActions.navigate({
    routeName: screenName,
    params: { ...props },
  });
}
export type NavigateType = typeof navigate;
