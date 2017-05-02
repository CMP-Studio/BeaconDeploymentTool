// @flow
import React, { Component } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { List } from 'immutable';

import type { AddNewBeaconType, UpdateBeaconType, UpdateBeaconUuidType } from '../actions/beacons';
import { Beacon } from '../actions/beacons';

import {
  activeColor,
  screenBackgroundColor,
  headingTextSize,
  textSupportingColor,
  textSize,
  textColor,
  plusTextSize,
} from '../styles';
import { paramsToProps } from '../utilities';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: screenBackgroundColor,
  },
  row: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowHeaderText: {
    fontSize: headingTextSize,
    color: textSupportingColor,
  },
  rowTitleItem: {
    flex: 0.3,
    alignItems: 'flex-start',
  },
  rowTitleText: {
    fontSize: textSize,
    color: textColor,
  },
  rowDataItem: {
    flex: 0.7,
    alignItems: 'flex-end',
  },
  rowDataText: {
    fontSize: textSize,
    color: activeColor,
  },
  rowDataEditableText: {
    textAlign: 'right',
  },
});

type Props = {
  beaconUuid: string,
  allBeacons: any,
  actions: {
    addNewBeacon: AddNewBeaconType,
    updateBeacon: UpdateBeaconType,
    updateBeaconUuid: UpdateBeaconUuidType,
  },
};

type State = {
  newBeacon: boolean,
  name: string,
  uuid: string,
  floor: string,
  region: Array<string>,
  blocks: Array<string>,
};

class ScreenBeaconInfo extends Component<void, Props, State> {
  static navigationOptions = ({ navigation }) => {
    const { beaconUuid, actions } = navigation.state.params;

    let deleteButton;
    if (beaconUuid) {
      deleteButton = (
        <Button
          title="Delete"
          color={activeColor}
          onPress={() => {
            actions.deleteBeacon(beaconUuid);
          }}
        />
      );
    }

    const screenTitle = navigation.state.params.screenTitle || 'Beacon Info';
    return {
      title: screenTitle,
      headerRight: deleteButton,
    };
  };

  constructor(props) {
    super(props);

    this.editBeacon.bind(this);

    if (props.beaconUuid) {
      const beacon = props.allBeacons.get(props.beaconUuid);
      this.state = {
        newBeacon: false,
        name: beacon.name,
        uuid: beacon.uuid,
        floor: beacon.floor,
        region: beacon.region,
        blocks: beacon.blocks,
      };
    } else {
      this.state = {
        newBeacon: true,
        name: 'Beacon Name',
        uuid: '0:0',
        floor: '7',
        region: [],
        blocks: [],
      };
    }
  }

  editBeacon(key, value) {
    const obj = {};
    obj[key] = value;

    if (this.state.newBeacon) {
      this.setState(obj);
    } else {
      const newState = Object.assign({}, this.state, obj);
      const newBeacon = Beacon({
        name: newState.name,
        uuid: newState.uuid,
        floor: newState.floor,
        region: newState.region,
        blocks: List([...newState.blocks]),
      });

      if (key === 'uuid') {
        const oldUuid = this.state.uuid;

        this.setState({ uuid: newState.uuid }, () => {
          this.props.actions.updateBeaconUuid(newBeacon, oldUuid);
        });
      } else {
        this.props.actions.updateBeacon(newBeacon);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.newBeacon) {
      const beacon = nextProps.allBeacons.get(this.state.uuid);

      if (beacon) {
        this.setState({
          name: beacon.name,
          uuid: beacon.uuid,
          floor: beacon.floor,
          region: beacon.region,
          blocks: beacon.blocks,
        });
      }
    }
  }

  render() {
    const plusButton = (onPress) => {
      return (
        <TouchableOpacity onPress={onPress}>
          <Text style={{ color: activeColor, fontSize: plusTextSize }}>
            {'+'}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.rowTitleItem}>
            <Text style={styles.rowHeaderText}>Info</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowTitleItem}>
            <Text style={styles.rowTitleText}>Name</Text>
          </View>
          <TextInput
            style={[styles.rowDataItem, styles.rowDataText, styles.rowDataEditableText]}
            onChangeText={(text) => {
              this.editBeacon('name', text);
            }}
            value={this.state.name}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.rowTitleItem}>
            <Text style={styles.rowTitleText}>ID</Text>
          </View>
          <TextInput
            style={[styles.rowDataItem, styles.rowDataText, styles.rowDataEditableText]}
            onChangeText={(text) => {
              this.editBeacon('uuid', text);
            }}
            value={this.state.uuid}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.rowTitleItem}>
            <Text style={styles.rowTitleText}>Floor</Text>
          </View>
          <TextInput
            style={[styles.rowDataItem, styles.rowDataText, styles.rowDataEditableText]}
            onChangeText={(text) => {
              this.editBeacon('floor', text);
            }}
            value={this.state.floor}
          />
        </View>
        <View style={styles.row}>
          <View style={styles.rowTitleItem}>
            <Text style={styles.rowHeaderText}>Regions</Text>
          </View>
          <View style={styles.rowDataItem}>
            {plusButton(() => {
              console.log('New Beacon Region');
            })}
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowTitleItem}>
            <Text style={styles.rowHeaderText}>Blocks</Text>
          </View>
          <View style={styles.rowDataItem}>
            {plusButton(() => {
              console.log('New Block Rule');
            })}
          </View>
        </View>
      </View>
    );
  }
}

export default paramsToProps(ScreenBeaconInfo);
