import { connect } from 'react-redux';

import RootScreen from '../components/rootScreen';

import { navigate } from '../actions/navigation';

const mapStateToProps = (state) => {
  const tabState = state.navigation.tabState;

  return {
    tabState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch, // Required for react-navigation
    actions: {
      navigate,
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
