import React from 'react';

import { addNavigationHelpers, TabNavigator } from 'react-navigation';

import { initialState } from '../reducers/navigation';

export const Navigator = TabNavigator(...initialState);

const RootScreen = (props) => {
  return (
    <Navigator
      navigation={addNavigationHelpers({
        dispatch: props.dispatch,
        state: props.navigation,
      })}
    />
  );
};

export default RootScreen;
