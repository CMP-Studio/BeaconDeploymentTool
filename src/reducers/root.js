import { combineReducers } from 'redux';

import navigation from './navigation';
import beacons from './beacons';
import wayfinding from './wayfinding';
import detected from './detected';

const rootReducer = combineReducers({
  navigation,
  beacons,
  wayfinding,
  detected,
});

export default rootReducer;
