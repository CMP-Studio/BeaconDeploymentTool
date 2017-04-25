// @flow
import React from 'react';
import { View, TouchableOpacity, Button, Text, StyleSheet } from 'react-native';
import ImmutableListView from 'react-native-immutable-list-view';

import type { NavigateType } from '../actions/navigation';
import type { BeaconType } from '../actions/beacons';

import { activeColor, screenBackgroundColor } from '../styles';
import { SCREEN_BEACON_INFO_BEACONS } from '../actions/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: screenBackgroundColor,
  },
});

const renderItem = (beacon: BeaconType, navigate: NavigateType) => {
  const beaconName = beacon.get('name');

  return (
    <View>
      <Button
        title={beaconName}
        color={activeColor}
        onPress={() => {
          navigate(SCREEN_BEACON_INFO_BEACONS, {
            beacon,
            text: beaconName,
            screenTitle: beaconName,
          });
        }}
      />
    </View>
  );
};

type ScreenBeaconListProps = {
  // I'm sorry for the next two types...
  beacons: [BeaconType],
  screenProps: {
    navActions: {
      navigate: NavigateType, // eslint-disable-line
    },
  },
};

const ScreenBeaconList = (props: ScreenBeaconListProps) => {
  return (
    <View style={styles.container}>
      <ImmutableListView
        immutableData={props.beacons}
        renderRow={(item) => {
          const { navigate } = props.screenProps.navActions;
          return renderItem(item, navigate);
        }}
      />
    </View>
  );
};

ScreenBeaconList.navigationOptions = ({ navigation, screenProps }) => {
  const { navigate } = screenProps.navActions;

  return {
    title: 'Beacons',
    headerRight: (
      <View
        style={{
          width: 40,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigate(SCREEN_BEACON_INFO_BEACONS, {
              text: 'New Beacon',
              screenTitle: 'New Beacon',
            });
          }}
        >
          <Text style={{ color: activeColor, fontSize: 35, marginTop: -5 }}>
            {'+'}
          </Text>
        </TouchableOpacity>
      </View>
    ),
  };
};

export default ScreenBeaconList;
