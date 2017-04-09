import { bindActionCreators } from 'redux';
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
    actions: bindActionCreators({ navigate }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);
