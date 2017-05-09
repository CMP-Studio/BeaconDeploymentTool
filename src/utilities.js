/* eslint-disable react/no-multi-comp */
import React, { Component } from 'react';
import { View } from 'react-native';

import shallowEqual from 'fbjs/lib/shallowEqual';

import { inactiveTabColor } from './styles';

export const paramsToProps = (SomeComponent) => {
  // turns this.props.navigation.state.params into this.params.<x>
  return class extends Component {
    static navigationOptions = SomeComponent.navigationOptions;
    // everything else, call as SomeComponent
    render() {
      const { navigation, ...otherProps } = this.props;
      const { state: { params } } = navigation;
      return <SomeComponent {...this.props} {...params} />;
    }
  };
};

export const pureStatelessComponent = (SomeComponent, shouldComponentUpdateArg) => {
  return class extends Component {
    static navigationOptions = SomeComponent.navigationOptions;

    shouldComponentUpdate(nextProps, nextState) {
      if (shouldComponentUpdateArg) {
        return shouldComponentUpdateArg(this.props, nextProps, this.state, nextState);
      }

      return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState);
    }

    render() {
      return <SomeComponent {...this.props} />;
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
