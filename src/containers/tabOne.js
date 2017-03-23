import { connect } from 'react-redux';

import TabOne from '../components/tabOne';

const mapStateToProps = (state) => {
  const tabOneState = state.navigation.tabOneState;

  return {
    tabOneState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch, // Required for react-navigation
    actions: {},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TabOne);
