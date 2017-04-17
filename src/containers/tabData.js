import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TabData from '../components/tabData';

import { navigate } from '../actions/navigation';

const mapStateToProps = (state) => {
  const tabDataState = state.navigation.tabDataState;

  return {
    tabDataState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch, // Required for react-navigation
    actions: bindActionCreators({ navigate }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabData);
