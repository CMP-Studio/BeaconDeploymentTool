import React from 'react';

import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import { tabDataInitialState } from '../reducers/navigation';

export const Navigator = StackNavigator(...tabDataInitialState);

const TabData = (props) => {
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
