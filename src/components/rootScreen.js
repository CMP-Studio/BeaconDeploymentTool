// @flow
import React from 'react';
import { addNavigationHelpers, TabNavigator } from 'react-navigation';

import type { NavigateType } from '../actions/navigation';

import { tabInitialState } from '../reducers/navigation';

export const Navigator = TabNavigator(...tabInitialState);

type RootScreenProps = {
  // I'm sorry for the next two types...
  dispatch: any => void,
  tabState: any,
  actions: {
    navigate: NavigateType,
  },
};

const RootScreen = (props: RootScreenProps) => {
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
