import React from 'react';

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
