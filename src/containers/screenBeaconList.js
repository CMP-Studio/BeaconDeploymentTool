import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { deleteBeacon } from '../actions/beacons';

import ScreenBeaconList from '../components/screenBeaconList';

const mapStateToProps = (state) => {
  const allBeacons = state.beacons.allBeacons;
  const regionsByFloor = state.beacons.regionsByFloor;

  return {
    allBeacons,
    regionsByFloor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ deleteBeacon }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenBeaconList);
