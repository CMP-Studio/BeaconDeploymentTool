import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TabDetect from '../components/tabDetect';

import { navigate } from '../actions/navigation';

const mapStateToProps = (state) => {
  const tabDetectState = state.navigation.tabDetectState;

  return {
    tabDetectState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch, // Required for react-navigation
    actions: bindActionCreators({ navigate }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabDetect);
