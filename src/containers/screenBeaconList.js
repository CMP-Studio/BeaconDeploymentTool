import { connect } from 'react-redux';

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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenBeaconList);
