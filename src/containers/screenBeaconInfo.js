import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ScreenBeaconInfo from '../components/screenBeaconInfo';

import { addNewBeacon } from '../actions/beacons';

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({ addNewBeacon }, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenBeaconInfo);
