import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { deleteBeacon } from '../actions/beacons';

import ScreenDetect from '../components/screenDetect';

const mapStateToProps = (state) => {
  const regionsByFloor = state.beacons.regionsByFloor;
  const allBeacons = state.beacons.allBeacons;

  return {
    regionsByFloor,
    allBeacons,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ deleteBeacon }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenDetect);
