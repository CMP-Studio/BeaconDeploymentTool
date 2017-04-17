import React from 'react';

import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import { tabBeaconsInitialState } from '../reducers/navigation';

export const Navigator = StackNavigator(...tabBeaconsInitialState);

const TabBeacons = (props) => {
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
};

export default TabBeacons;
