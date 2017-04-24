// @flow
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { List, Map } from 'immutable';

import type { BeaconType, AddNewBeaconType } from '../actions/beacons';

import { paramsToProps } from '../utilities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1FF',
  },
});

type ScreenBeaconInfoProps = {
  text: string,
  beacon: BeaconType,
  actions: {
    addNewBeacon: AddNewBeaconType,
  },
};

const ScreenBeaconInfo = (props: ScreenBeaconInfoProps) => {
  let content;

  if (props.beacon) {
    content = (
      <Text>
        {props.text}
      </Text>
    );
  } else {
    content = (
      <Button
        title={'New Beacon'}
        onPress={() => {
          props.actions.addNewBeacon(
            Map({
              name: 'Testing Beacon 2',
              uuid: '20688:13234',
              region: 'blue',
              floor: 7,
              blocks: List([]),
            }),
          );
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {content}
    </View>
  );
};

ScreenBeaconInfo.navigationOptions = ({ navigation }) => {
  const screenTitle = navigation.state.params.screenTitle || 'Beacon Info';
  return {
    title: screenTitle,
  };
};

export default paramsToProps(ScreenBeaconInfo);
