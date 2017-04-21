import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

import { SCREEN_BEACON_INFO_BEACONS } from '../actions/navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF9F',
  },
});

const ScreenBeaconList = (props) => {
  return (
    <View style={styles.container}>
      <Button
        title={'Beacon Info'}
        onPress={() => {
          const { navigate } = props.screenProps.navActions;
          navigate(SCREEN_BEACON_INFO_BEACONS, {
            text: 'Beacons - Beacon info',
            screenTitle: 'Beacons - Beacon info',
          });
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
