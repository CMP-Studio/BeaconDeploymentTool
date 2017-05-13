// @flow
import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

import type { NavigateType } from '../actions/navigation';

import { activeColor, screenBackgroundColor } from '../styles';
import { SCREEN_BEACON_INFO_DETECT } from '../actions/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: screenBackgroundColor,
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
  const { bluetoothOn, locationServicesStatus, requestLocationServicesAuthorization } = props;

  return (
    <View style={styles.container}>
      <View>
        <Text>
          {bluetoothOn ? 'Bluetooth On' : 'Bluetooth Off'}
        </Text>
      </View>

      <View>
        <Text>
          {locationServicesStatus}
        </Text>
      </View>

      <Button
        title={'Request Location'}
        color={activeColor}
        onPress={() => {
          requestLocationServicesAuthorization();
        }}
      />

      <Button
        title={'Beacon Info'}
        color={activeColor}
        onPress={() => {
          const { navigate } = props.screenProps.navActions;
          const beacon = props.allBeacons.get('1');
          const deleteBeacon = props.deleteBeacon;

          navigate(SCREEN_BEACON_INFO_DETECT, {
            beaconUuid: beacon.uuid,
            screenTitle: beacon.name,
            deleteBeacon,
          });
        }}
      />
    </View>
  );
};

ScreenDetect.navigationOptions = {
  title: 'Detect',
};

export default ScreenDetect;
