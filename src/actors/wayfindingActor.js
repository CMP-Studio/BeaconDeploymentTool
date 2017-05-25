import { NativeModules, NativeEventEmitter } from 'react-native';

import {
  LOCATION_SERVICES_STATUS_AUTHORIZED,
  // startScanningForBeacons,
  updateWayfindingStatus,
  startScanningSuccessful,
  startScanningFailure,
  detectedBeacons,
} from '../actions/wayfinding';

export default class WayfindingActor {
  constructor(store) {
    this.BeaconManager = NativeModules.CMSBeaconManager;
    this.BeaconManagerObserver = new NativeEventEmitter(this.BeaconManager);
    this.dispatch = store.dispatch;
    this.store = store;
    this.listeningForBeaconPings = false;

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
      this.startScanningForBeacons(rangingUUID, rangingIdentifier);
    } else {
      this.stopListeningForBeaconPings();
    }
  }

  async startScanningForBeacons(rangingUUID, rangingIdentifier) {
    try {
      await this.BeaconManager.startTracking(rangingUUID, rangingIdentifier);

      this.dispatch(startScanningSuccessful(rangingUUID, rangingIdentifier));
      this.listenForBeaconPings();
    } catch (e) {
      console.log(e);
      this.dispatch(startScanningFailure(e));
      this.stopListeningForBeaconPings();
    }
  }

  stopListeningForBeaconPings() {
    const { BeaconManagerBeaconPing } = this.BeaconManager.Events;

    this.BeaconManagerObserver.removeAllListeners(BeaconManagerBeaconPing);
    this.listeningForBeaconPings = false;
  }

  listenForBeaconPings() {
    if (this.listeningForBeaconPings) {
      return;
    }
    this.listeningForBeaconPings = true;

    let update = true;
    let updateTimer;
    const UPDATE_INTERVAL = 1; // in seconds

    const { BeaconManagerBeaconPing } = this.BeaconManager.Events;

    this.BeaconManagerObserver.addListener(BeaconManagerBeaconPing, (beacons) => {
      if (update) {
        updateTimer = null;
        update = false;

        this.dispatch(detectedBeacons(beacons));
      } else if (updateTimer == null) {
        updateTimer = setTimeout(() => {
          update = true;
        }, 1000 * UPDATE_INTERVAL);
      }
    });
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
