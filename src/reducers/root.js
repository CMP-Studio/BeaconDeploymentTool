import { combineReducers } from 'redux';

import navigation from './navigation';
import beaconBlockRules from './beaconBlockRules';

const rootReducer = combineReducers({
  navigation,
  beaconBlockRules,
});

export default rootReducer;
