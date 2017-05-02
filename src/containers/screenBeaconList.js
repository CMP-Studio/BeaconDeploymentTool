import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { deleteBeacon } from '../actions/beacons';

import ScreenBeaconList from '../components/screenBeaconList';

const mapStateToProps = (state) => {
  const regionsByFloor = state.beacons.regionsByFloor;

  return {
    regionsByFloor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ deleteBeacon }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenBeaconList);
