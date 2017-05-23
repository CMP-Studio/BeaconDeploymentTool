// @flow
import React from 'react';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import type { NavigateType } from '../actions/navigation';

import { renderTabBarIcon } from '../utilityViews';
import { tabDetectInitialState } from '../reducers/navigation';

export const Navigator = StackNavigator(...tabDetectInitialState);

type TabDetectProps = {
  // I'm sorry for the next two types...
  dispatch: any => void,
  tabDetectState: any,
  actions: {
    navigate: NavigateType,
  },
};

const TabDetect = (props: TabDetectProps) => {
  return (
    <Navigator
      navigation={addNavigationHelpers({
        dispatch: props.dispatch,
        state: props.tabDetectState,
      })}
      screenProps={{
        navActions: {
          navigate: props.actions.navigate,
          navigateAndCreateBeacon: props.actions.navigateAndCreateBeacon,
        },
      }}
    />
  );
};

TabDetect.navigationOptions = {
  title: 'Detect',
  tabBarIcon: renderTabBarIcon,
};

export default TabDetect;
