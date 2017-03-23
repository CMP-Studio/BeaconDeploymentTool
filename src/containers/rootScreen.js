import { connect } from 'react-redux';

import RootScreen from '../components/rootScreen';

const mapStateToProps = (state) => {
  return {
    navigation: state.navigation,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch, // Required for react-navigation
    actions: {},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
