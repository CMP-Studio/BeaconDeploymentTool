import {
  START_SCANNING_SUCCESS,
  START_SCANNING_FAILURE,
  UPDATE_WAYFINDING_STATUS,
  LOCATION_SERVICES_STATUS_NOTDETERMINED,
} from '../actions/wayfinding';

const initalState = {
  bluetoothOn: false,
  locationServicesStatus: LOCATION_SERVICES_STATUS_NOTDETERMINED,
  currentlyDetecting: false,
  rangingUUID: 'F7826DA6-4FA2-4E98-8024-BC5B71E0893E',
  rangingIdentifier: 'Beacon Deployment Tool',
};

const wayfinding = (state = initalState, action) => {
  switch (action.type) {
    case UPDATE_WAYFINDING_STATUS: {
      return Object.assign({}, state, {
        currentlyDetecting: false,
        bluetoothOn: action.bluetoothOn,
        locationServicesStatus: action.locationServicesStatus,
      });
    }

    case START_SCANNING_SUCCESS: {
      return Object.assign({}, state, {
        currentlyDetecting: true,
        rangingIdentifier: action.rangingIdentifier,
        rangingUUID: action.rangingUUID,
      });
    }

    case START_SCANNING_FAILURE: {
      return Object.assign({}, state, {
        currentlyDetecting: false,
      });
    }

    default: {
      return state;
    }
  }
};

export default wayfinding;
