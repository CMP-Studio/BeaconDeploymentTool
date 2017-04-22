import { List, Map } from 'immutable';

const initalState = List([
  Map({
    name: 'Testing Beacon',
    uuid: '20688:13234',
    region: 'blue',
    floor: 7,
    blocks: List([]),
  }),
  Map({
    name: 'Beacon #2',
    uuid: '54351:29236',
    region: 'red',
    floor: 7,
    blocks: List([]),
  }),
]);

const beaconBlockRules = (state = initalState, action) => {
  return state;
};

export default beaconBlockRules;
