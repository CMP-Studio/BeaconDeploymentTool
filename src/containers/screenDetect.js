import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { deleteBeacon } from '../actions/beacons';
import { requestLocationServicesAuthorization } from '../actions/wayfinding';

import ScreenDetect from '../components/screenDetect';

const mapStateToProps = (state) => {
  const regionsByFloor = state.beacons.regionsByFloor;
  const allBeacons = state.beacons.allBeacons;
  const currentlyDetecting = state.wayfinding.currentlyDetecting;
  const bluetoothOn = state.wayfinding.bluetoothOn;
  const locationServicesStatus = state.wayfinding.locationServicesStatus;

  return {
    regionsByFloor,
    allBeacons,
    bluetoothOn,
    locationServicesStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ deleteBeacon, requestLocationServicesAuthorization }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenDetect);
