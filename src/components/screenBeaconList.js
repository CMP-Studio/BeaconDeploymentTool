// @flow
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

import ImmutableListView from 'react-native-immutable-list-view';

import type { NavigateType } from '../actions/navigation';
import type { BeaconType } from '../actions/beacons';

import { SCREEN_BEACON_INFO_BEACONS } from '../actions/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9F',
  },
});

const renderItem = (beacon: BeaconType, navigate: NavigateType) => {
  const beaconName = beacon.get('name');

  return (
    <View>
      <Button
        title={beaconName}
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
      <Button
        title="+"
        onPress={() => {
          navigate(SCREEN_BEACON_INFO_BEACONS, {
            text: 'New Beacon',
            screenTitle: 'New Beacon',
          });
        }}
      />
    ),
  };
};

export default ScreenBeaconList;
