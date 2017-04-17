import React from 'react';

import { addNavigationHelpers, TabNavigator } from 'react-navigation';

import { tabInitialState } from '../reducers/navigation';

export const Navigator = TabNavigator(...tabInitialState);

const RootScreen = (props) => {
  return (
    <Navigator
      navigation={addNavigationHelpers({
        dispatch: props.dispatch,
        state: props.tabState,
      })}
      screenProps={{
        navActions: {
          navigate: props.actions.navigate,
        },
      }}
    />
  );
};

export default RootScreen;
