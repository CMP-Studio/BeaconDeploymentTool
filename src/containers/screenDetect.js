import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { deleteBeacon } from '../actions/beacons';
import { requestLocationServicesAuthorization } from '../actions/wayfinding';

import ScreenDetect from '../components/screenDetect';

const mapStateToProps = (state) => {
  const allBeacons = state.beacons.allBeacons;

  const currentlyDetecting = state.wayfinding.currentlyDetecting;
  const bluetoothOn = state.wayfinding.bluetoothOn;
  const locationServicesStatus = state.wayfinding.locationServicesStatus;

  const detectedFloor = state.detected.detectedFloor;
  const detectedRegions = state.detected.detectedRegions;
  const unknownBeacons = state.detected.unknownBeacons;
  const blockedBy = state.detected.blockedBy;
  const regionsByFloor = state.detected.regionsByFloor;

  return {
    allBeacons,
    bluetoothOn,
    currentlyDetecting,
    locationServicesStatus,
    detectedFloor,
    detectedRegions,
    unknownBeacons,
    blockedBy,
    regionsByFloor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ deleteBeacon, requestLocationServicesAuthorization }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenDetect);
