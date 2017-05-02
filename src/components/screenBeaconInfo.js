// @flow
import React, { Component } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { List } from 'immutable';

import type {
  BeaconType,
  UpdateBeaconType,
  RecreateBeaconType,
  DeleteBeaconType,
} from '../actions/beacons';
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

class ScreenBeaconInfo extends Component {
  static navigationOptions = ({ navigation }) => {
    const { beaconUuid, deleteBeacon } = navigation.state.params;

    const disableDelete = !beaconUuid;
    const deleteBeaconAction = () => {
      deleteBeacon(beaconUuid);
    };

    const deleteButton = (
      <Button
        title="Delete"
        color={activeColor}
        disabled={disableDelete}
        onPress={deleteBeaconAction}
      />
    );

    const screenTitle = navigation.state.params.screenTitle || 'Beacon Info';
    return {
      title: screenTitle,
      headerRight: deleteButton,
    };
  };

  constructor(props) {
    super(props);

    this.updateState.bind(this);
    this.updateBeacon.bind(this);
    this.updateHeader.bind(this);

    if (props.beaconUuid) {
      const beacon = props.allBeacons.get(props.beaconUuid);
      this.state = {
        name: beacon.name,
        uuid: beacon.uuid,
        floor: beacon.floor,
        region: beacon.region,
        blocks: beacon.blocks,
      };
    } else {
      this.state = {
        name: 'Unnamed',
        uuid: 'None',
        floor: 'Unassigned',
        region: 'Unassigned',
        blocks: List(),
      };
    }
  }

  state: {
    prevUuid?: string,
    name: string,
    uuid: string,
    floor: string,
    region: Array<string>,
    blocks: List<BeaconType>,
  };

  componentWillReceiveProps(nextProps) {
    const beacon: BeaconType = nextProps.allBeacons.get(this.state.uuid);

    if (beacon) {
      const prevUuid = this.state.prevUuid;
      this.setState(
        () => {
          return {
            prevUuid: null,
            name: beacon.name,
            uuid: beacon.uuid,
            floor: beacon.floor,
            region: beacon.region,
            blocks: beacon.blocks,
          };
        },
        () => {
          if (nextProps.screenTitle !== beacon.name || prevUuid != null) {
            this.updateHeader(beacon.name, beacon.uuid);
          }
        },
      );
    }
  }

  props: {
    screenTitle: string, // eslint-disable-line react/no-unused-prop-types
    navigation: any,
    beaconUuid: string,
    allBeacons: any,
    updateBeacon: UpdateBeaconType,
    recreateBeacon: RecreateBeaconType,
    deleteBeacon: DeleteBeaconType,
  };

  updateHeader(name, uuid) {
    this.props.navigation.setParams({
      screenTitle: name,
      beaconUuid: uuid,
      deleteBeacon: this.props.deleteBeacon,
    });
  }

  updateState(key, value) {
    this.setState(() => {
      const obj = {};
      obj[key] = value;

      if (key === 'uuid' && this.state.prevUuid == null) {
        obj.prevUuid = this.state.uuid;
      }

      return Object.assign({}, this.state, obj);
    });
  }

  updateBeacon(key) {
    const newBeacon = Beacon({
      name: this.state.name,
      uuid: this.state.uuid,
      floor: this.state.floor,
      region: this.state.region,
      // TODO Set this correctly
      blocks: List([...this.state.blocks]),
    });

    if (key === 'uuid') {
      this.props.recreateBeacon(newBeacon, this.state.prevUuid);
    } else {
      this.props.updateBeacon(newBeacon);
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
            returnKeyType={'done'}
            onChangeText={(text) => {
              this.updateState('name', text);
            }}
            onBlur={() => {
              this.updateBeacon();
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
            returnKeyType={'done'}
            onChangeText={(text) => {
              this.updateState('uuid', text);
            }}
            onBlur={() => {
              this.updateBeacon('uuid');
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
            returnKeyType={'done'}
            onChangeText={(text) => {
              this.updateState('floor', text);
            }}
            onBlur={() => {
              this.updateBeacon();
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
