// @flow
import React from 'react';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import type { NavigateType } from '../actions/navigation';

import { tabDataInitialState } from '../reducers/navigation';

export const Navigator = StackNavigator(...tabDataInitialState);

type TabDataProps = {
  // I'm sorry for the next two types...
  dispatch: any => void,
  tabDataState: any,
  actions: {
    navigate: NavigateType,
  },
};

const TabData = (props: TabDataProps) => {
  return (
    <Navigator
      navigation={addNavigationHelpers({
        dispatch: props.dispatch,
        state: props.tabDataState,
      })}
      screenProps={{
        navActions: {
          navigate: props.actions.navigate,
        },
      }}
    />
  );
};

TabData.navigationOptions = {
  title: 'Data',
};

export default TabData;
