// @flow

import { NavigationActions } from 'react-navigation';

type ScreenOneType = 'SCREEN_ONE';
export const SCREEN_ONE: ScreenOneType = 'SCREEN_ONE';

type ScreenTwoType = 'SCREEN_TWO';
export const SCREEN_TWO: ScreenTwoType = 'SCREEN_TWO';

type TabDetectType = 'TAB_DETECT';
export const TAB_DETECT: TabDetectType = 'TAB_DETECT';

type TabBeaconsType = 'TAB_BEACONS';
export const TAB_BEACONS: TabBeaconsType = 'TAB_BEACONS';

type TabDataType = 'TAB_DATA';
export const TAB_DATA: TabDataType = 'TAB_DATA';

type Screens = ScreenOneType | ScreenTwoType | TabDetectType | TabBeaconsType | TabDataType;

export function navigate(screenName: Screens, props: ?any) {
  return NavigationActions.navigate({
    routeName: screenName,
    params: { ...props },
  });
}
