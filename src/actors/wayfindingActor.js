import { NativeModules, NativeEventEmitter } from 'react-native';

import {
  LOCATION_SERVICES_STATUS_AUTHORIZED,
  // startScanningForBeacons,
  updateWayfindingStatus,
} from '../actions/wayfinding';

export default class WayfindingActor {
  constructor(store) {
    this.BeaconManager = NativeModules.CMSBeaconManager;
    this.BeaconManagerObserver = new NativeEventEmitter(this.BeaconManager);
    this.dispatch = store.dispatch;
    this.store = store;

    this.startListening();
  }

  startListening() {
    const { BluetoothStatusChanged, LocationServicesAllowedChanged } = this.BeaconManager.Events;

    this.BeaconManagerObserver.addListener(BluetoothStatusChanged, (body) => {
      const bluetoothOn = body.bluetoothOn;
      this.handleWayfindingChanges({ bluetoothOn });
    });

    this.BeaconManagerObserver.addListener(LocationServicesAllowedChanged, (body) => {
      const locationServicesStatus = body.locationServicesStatus;
      this.handleWayfindingChanges({ locationServicesStatus });
    });

    this.BeaconManager.beginBluetoothAndLocationServicesEvents();
    this.listening = true;
  }

  handleWayfindingChanges(newState) {
    const state = this.retrieveState();

    const { rangingUUID, rangingIdentifier } = state;

    let bluetoothOn;
    if (newState.bluetoothOn != null) {
      bluetoothOn = newState.bluetoothOn;
    } else {
      bluetoothOn = state.bluetoothOn;
    }

    let locationServicesStatus;
    if (newState.locationServicesStatus != null) {
      locationServicesStatus = newState.locationServicesStatus;
    } else {
      locationServicesStatus = state.locationServicesStatus;
    }

    this.dispatch(updateWayfindingStatus(bluetoothOn, locationServicesStatus));

    if (bluetoothOn && locationServicesStatus === LOCATION_SERVICES_STATUS_AUTHORIZED) {
      console.log('startScanningForBeacons');
      // this.dispatch(startScanningForBeacons(rangingUUID, rangingIdentifier));

      // TODO: Write beacon sensing logic here, maybe...
    }
  }

  retrieveState() {
    const state = this.store.getState();

    return {
      bluetoothOn: state.wayfinding.bluetoothOn,
      locationServicesStatus: state.wayfinding.locationServicesStatus,
      rangingUUID: state.wayfinding.rangingUUID,
      rangingIdentifier: state.wayfinding.rangingIdentifier,
    };
  }
}
