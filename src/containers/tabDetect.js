import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TabDetect from '../components/tabDetect';

import { navigate, navigateAndCreateBeacon } from '../actions/navigation';

const mapStateToProps = (state) => {
  const tabDetectState = state.navigation.tabDetectState;

  return {
    tabDetectState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch, // Required for react-navigation
    actions: bindActionCreators({ navigate, navigateAndCreateBeacon }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabDetect);
