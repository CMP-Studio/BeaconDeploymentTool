import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { deleteBeacon } from '../actions/beacons';
import { switchBeaconShowType, requestLocationServicesAuthorization } from '../actions/wayfinding';

import ScreenDetect from '../components/screenDetect';

const mapStateToProps = (state) => {
  const allBeacons = state.beacons.allBeacons;

  const currentlyDetecting = state.wayfinding.currentlyDetecting;
  const bluetoothOn = state.wayfinding.bluetoothOn;
  const locationServicesStatus = state.wayfinding.locationServicesStatus;

  const detectedFloor = state.detected.detectedFloor;
  const detectedRegions = state.detected.detectedRegions;
  const unknownBeacons = state.detected.unknownBeacons;
  const knownBeacons = state.detected.knownBeacons;
  const blockedBy = state.detected.blockedBy;
  const regionsByFloor = state.detected.regionsByFloor;
  const showBeaconsType = state.detected.showBeaconsType;

  return {
    allBeacons,
    bluetoothOn,
    currentlyDetecting,
    locationServicesStatus,
    detectedFloor,
    detectedRegions,
    unknownBeacons,
    knownBeacons,
    blockedBy,
    regionsByFloor,
    showBeaconsType,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      deleteBeacon,
      requestLocationServicesAuthorization,
      switchBeaconShowType,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenDetect);
