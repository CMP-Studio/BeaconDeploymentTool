import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import ImmutableListView from 'react-native-immutable-list-view';

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

const renderItem = (beacon, navigate) => {
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

const ScreenBeaconList = (props) => {
  return (
    <View style={styles.container}>
      <ImmutableListView
        immutableData={props.beacons}
        renderRow={(item) => {
          return renderItem(item, props.screenProps.navActions.navigate);
        }}
      />
    </View>
  );
};

ScreenBeaconList.navigationOptions = {
  title: 'Beacons',
  headerRight: (
    <Button
      title="+"
      onPress={() => {
        console.log('New Beacon');
      }}
    />
  ),
};

export default ScreenBeaconList;
