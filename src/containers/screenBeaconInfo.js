import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ScreenBeaconInfo from '../components/screenBeaconInfo';

import { addNewBeacon, updateBeacon, updateBeaconUuid, deleteBeacon } from '../actions/beacons';

const mapStateToProps = (state) => {
  const allBeacons = state.beacons.allBeacons;
  return { allBeacons };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { addNewBeacon, updateBeacon, updateBeaconUuid, deleteBeacon },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenBeaconInfo);
