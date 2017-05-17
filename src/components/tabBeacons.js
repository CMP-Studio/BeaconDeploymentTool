// @flow
import React from 'react';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import type { NavigateType } from '../actions/navigation';

import { renderTabBarIcon } from '../utilityViews';
import { tabBeaconsInitialState } from '../reducers/navigation';

export const Navigator = StackNavigator(...tabBeaconsInitialState);

type TabBeaconsProps = {
  // I'm sorry for the next two types...
  dispatch: any => void,
  tabBeaconsState: any,
  actions: {
    navigate: NavigateType,
  },
};

const TabBeacons = (props: TabBeaconsProps) => {
  return (
    <Navigator
      navigation={addNavigationHelpers({
        dispatch: props.dispatch,
        state: props.tabBeaconsState,
      })}
      screenProps={{
        navActions: {
          navigate: props.actions.navigate,
        },
      }}
    />
  );
};

TabBeacons.navigationOptions = {
  title: 'Beacons',
  tabBarIcon: renderTabBarIcon,
};

export default TabBeacons;
