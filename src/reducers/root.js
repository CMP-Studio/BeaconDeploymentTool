import { combineReducers } from 'redux';

import navigation from './navigation';
import beacons from './beacons';

const rootReducer = combineReducers({
  navigation,
  beacons,
});

export default rootReducer;
