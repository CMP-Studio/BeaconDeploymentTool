import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import TabOne from '../components/tabOne';

import { navigate } from '../actions/navigation';

const mapStateToProps = (state) => {
  const tabOneState = state.navigation.tabOneState;

  return {
    tabOneState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch, // Required for react-navigation
    actions: bindActionCreators({ navigate }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabOne);
