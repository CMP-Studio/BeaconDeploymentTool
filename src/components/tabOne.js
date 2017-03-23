import React from 'react';

import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import { tabOneState } from '../reducers/navigation';

export const Navigator = StackNavigator(...tabOneState);

const TabOne = (props) => {
  return (
    <Navigator
      navigation={addNavigationHelpers({
        dispatch: props.dispatch,
        state: props.tabOneState,
      })}
    />
  );
};

export default TabOne;
