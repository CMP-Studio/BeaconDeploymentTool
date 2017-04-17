import React from 'react';

import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import { tabDetectInitialState } from '../reducers/navigation';

export const Navigator = StackNavigator(...tabDetectInitialState);

const TabDetect = (props) => {
  return (
    <Navigator
      navigation={addNavigationHelpers({
        dispatch: props.dispatch,
        state: props.tabDetectState,
      })}
      screenProps={{
        navActions: {
          navigate: props.actions.navigate,
        },
      }}
    />
  );
};

TabDetect.navigationOptions = {
  title: 'Detect',
};

export default TabDetect;
