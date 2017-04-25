import React from 'react';
import { View } from 'react-native';

import { inactiveTabColor } from './styles';

export const paramsToProps = (SomeComponent) => {
  // turns this.props.navigation.state.params into this.params.<x>
  return class extends React.Component {
    static navigationOptions = SomeComponent.navigationOptions;
    // everything else, call as SomeComponent
    render() {
      const { navigation, ...otherProps } = this.props;
      const { state: { params } } = navigation;
      return <SomeComponent {...this.props} {...params} />;
    }
  };
};

export const renderTabBarIcon = ({ focused, tintColor }) => {
  const backgroundColor = focused ? tintColor : inactiveTabColor;
  const iconSize = 26;
  return (
    <View
      style={{ backgroundColor, width: iconSize, height: iconSize, borderRadius: iconSize / 4 }}
    />
  );
};
