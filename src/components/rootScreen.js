import React from 'react';

import { addNavigationHelpers, TabNavigator } from 'react-navigation';

import { tabState } from '../reducers/navigation';

export const Navigator = TabNavigator(...tabState);

const RootScreen = (props) => {
  return (
    <Navigator
      navigation={addNavigationHelpers({
        dispatch: props.dispatch,
        state: props.tabState,
      })}
    />
  );
};

export default RootScreen;
