import { connect } from 'react-redux';

import RootScreen from '../components/rootScreen';

const mapStateToProps = (state) => {
  const tabState = state.navigation.tabState;

  return {
    tabState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch, // Required for react-navigation
    actions: {},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
