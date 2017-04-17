// @flow

import { NavigationActions } from 'react-navigation';

type ScreenDetectType = 'SCREEN_DETECT';
export const SCREEN_DETECT: ScreenDetectType = 'SCREEN_DETECT';

type ScreenBeaconListType = 'SCREEN_BEACON_LIST';
export const SCREEN_BEACON_LIST: ScreenBeaconListType = 'SCREEN_BEACON_LIST';

type ScreenDataType = 'SCREEN_DATA';
export const SCREEN_DATA: ScreenDataType = 'SCREEN_DATA';

type ScreenBeaconInfoDetectType = 'SCREEN_BEACON_INFO_DETECT';
export const SCREEN_BEACON_INFO_DETECT: ScreenBeaconInfoDetectType = 'SCREEN_BEACON_INFO_DETECT';

type ScreenBeaconInfoBeaconsType = 'SCREEN_BEACON_INFO_BEACONS';
export const SCREEN_BEACON_INFO_BEACONS: ScreenBeaconInfoBeaconsType = 'SCREEN_BEACON_INFO_BEACONS';

type TabDetectType = 'TAB_DETECT';
export const TAB_DETECT: TabDetectType = 'TAB_DETECT';

type TabBeaconsType = 'TAB_BEACONS';
export const TAB_BEACONS: TabBeaconsType = 'TAB_BEACONS';

type TabDataType = 'TAB_DATA';
export const TAB_DATA: TabDataType = 'TAB_DATA';

type Screens =
  | ScreenDetectType
  | ScreenBeaconListType
  | ScreenDataType
  | ScreenBeaconInfoDetectType
  | ScreenBeaconInfoBeaconsType
  | TabDetectType
  | TabBeaconsType
  | TabDataType;

export function navigate(screenName: Screens, props: ?any) {
  return NavigationActions.navigate({
    routeName: screenName,
    params: { ...props },
  });
}
