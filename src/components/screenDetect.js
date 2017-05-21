// @flow
import React from 'react';
import { View, Button, Text, StyleSheet, Linking, Alert } from 'react-native';

import type { NavigateType } from '../actions/navigation';

import { activeColor, screenBackgroundColor, headingTextSize, largeTextSize } from '../styles';
import { SCREEN_BEACON_INFO_DETECT } from '../actions/navigation';

import {
  LOCATION_SERVICES_STATUS_NOTDETERMINED,
  LOCATION_SERVICES_STATUS_DENIED,
} from '../actions/wayfinding';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: screenBackgroundColor,
  },
  blueToothMessage: {
    fontSize: headingTextSize,
  },
  notDetectingContainer: {
    margin: 10,
  },
  bluetoothMessageContainer: {
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 5,
  },
  detectedContainer: {
    marginVertical: 10,
  },
  detetedHeadingText: {
    textAlign: 'center',
    fontSize: headingTextSize,
    marginBottom: 8,
  },
  detectedDataText: {
    textAlign: 'center',
    fontSize: largeTextSize,
    marginBottom: 8,
  },
});

type ScreenDetectProps = {
  screenProps: {
    navActions: {
      navigate: NavigateType, // eslint-disable-line
    },
  },
};

const ScreenDetect = (props: ScreenDetectProps) => {
  const {
    bluetoothOn,
    locationServicesStatus,
    requestLocationServicesAuthorization,
    currentlyDetecting,
    detectedRegions,
    detectedFloor,
  } = props;

  let content;

  // if (!currentlyDetecting) {
  if (false) {
    let blueToothMessage;
    let locationServicesMessage;

    if (!bluetoothOn) {
      blueToothMessage = (
        <View style={styles.bluetoothMessageContainer}>
          <Text style={styles.blueToothMessage}>
            Enable bluetooth
          </Text>
        </View>
      );
    }

    if (locationServicesStatus === LOCATION_SERVICES_STATUS_NOTDETERMINED) {
      locationServicesMessage = (
        <Button
          title={'Allow app to use your Location'}
          color={activeColor}
          onPress={() => {
            requestLocationServicesAuthorization();
          }}
        />
      );
    } else if (locationServicesStatus === LOCATION_SERVICES_STATUS_DENIED) {
      locationServicesMessage = (
        <Button
          title={'Allow app to use your Location'}
          color={activeColor}
          onPress={() => {
            Alert.alert(
              'Location Access',
              'Go to Settings, then Privacy, then Location Services, then Beacon Deployment Tool to allow location access while using this app.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Settings',
                  onPress: () => {
                    const url = 'app-settings:';
                    Linking.canOpenURL(url).then((supported) => {
                      if (!supported) {
                        console.error(`Can\'t handle url: ${url}`);
                        return;
                      }

                      Linking.openURL(url);
                    });
                  },
                },
              ],
            );
          }}
        />
      );
    }

    content = (
      <View style={styles.notDetectingContainer}>
        <Text>
          {'Cannot detect any beacons.\nPlease follow the instructions below to fix this issuie.'}
        </Text>
        {blueToothMessage}
        {locationServicesMessage}
      </View>
    );
  } else {
    const detectedRegionsText = detectedRegions.size !== 0 ? detectedRegions.join(', ') : 'None';
    const detectedFloorsText = detectedFloor || 'None';

    content = (
      <View style={styles.detectedContainer}>
        <View>
          <Text style={styles.detetedHeadingText}>
            {'Detected Regions'}
          </Text>
          <Text style={styles.detectedDataText}>
            {detectedRegionsText}
          </Text>
        </View>
        <View>
          <Text style={styles.detetedHeadingText}>
            {'Detected Floor'}
          </Text>
          <Text style={styles.detectedDataText}>
            {detectedFloorsText}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {content}
    </View>
  );
};

ScreenDetect.navigationOptions = {
  title: 'Detect',
};

export default ScreenDetect;
