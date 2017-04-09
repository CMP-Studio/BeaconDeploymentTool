import { NavigationActions } from 'react-navigation';

export const SCREEN_ONE = 'SCREEN_ONE';
export const SCREEN_TWO = 'SCREEN_TWO';
export const TAB_ONE = 'TAB_ONE';
export const TAB_TWO = 'TAB_TWO';

export function navigate(screenName, props) {
  return NavigationActions.navigate({
    routeName: screenName,
    params: { ...props },
  });
}
