// @flow
import React, { Component } from 'react';
import {
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { List } from 'immutable';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  listSeparatorColor,
} from '../styles';
import { paramsToProps } from '../utilities';

const styles = StyleSheet.create({
  container: {
    backgroundColor: screenBackgroundColor,
  },
  contentContainer: {
    flexDirection: 'column',
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
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
  rowListText: {
    fontSize: textSize,
  },
  removeButton: {
    borderColor: activeColor,
    borderWidth: 1,
    borderRadius: 5,
    height: 40,
    paddingHorizontal: 15,
  },
  removeButtonTitle: {
    fontSize: textSize,
    color: activeColor,
  },
});

class ScreenBeaconInfo extends Component {
  static navigationOptions = ({ navigation }) => {
    const { beaconUuid, deleteBeacon } = navigation.state.params;

    const disableDelete = !beaconUuid;
    const deleteBeaconAction = () => {
      Alert.alert(
        'Delete Beacon',
        'Are you sure you want to delete this beacon? This action cannot be undone.',
        [
          {
            text: 'Delete',
            onPress: () => {
              deleteBeacon(beaconUuid);
            },
            style: 'destructive',
          },
          { text: 'Cancel', style: 'cancel' },
        ],
        { cancelable: false },
      );
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
    this.renderList.bind(this);

    if (props.beaconUuid) {
      const beacon = props.allBeacons.get(props.beaconUuid);
      this.state = {
        name: beacon.name,
        uuid: beacon.uuid,
        floor: beacon.floor,
        regions: beacon.regions,
        blocks: beacon.blocks,
      };
    } else {
      this.state = {
        name: 'Unnamed',
        uuid: 'None',
        floor: 'Unassigned',
        regions: List(),
        blocks: List(),
      };
    }
  }

  state: {
    prevUuid?: string,
    name: string,
    uuid: string,
    floor: string,
    regions: List<string>,
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
            regions: beacon.regions,
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
      regions: this.state.regions,
      blocks: this.state.blocks,
    });

    if (key === 'uuid') {
      this.props.recreateBeacon(newBeacon, this.state.prevUuid);
    } else {
      this.props.updateBeacon(newBeacon);
    }
  }

  renderList(listData) {
    const RemoveButton = () => {
      return (
        <TouchableOpacity
          onPress={() => {
            console.log('remove');
          }}
        >
          <View style={[styles.row, styles.removeButton]}>
            <Text style={styles.removeButtonTitle}>Remove</Text>
          </View>
        </TouchableOpacity>
      );
    };

    return listData.toArray().map((datum, index, array) => {
      const lastItem = index === array.length - 1;

      return (
        <View
          key={datum}
          style={[
            styles.row,
            lastItem
              ? { marginBottom: 10 }
              : {
                height: 45,
                borderBottomColor: listSeparatorColor,
                borderBottomWidth: 1,
              },
          ]}
        >
          <View style={styles.rowTitleItem}>
            <Text style={styles.rowListText}>{datum}</Text>
          </View>
          {RemoveButton(datum)}
        </View>
      );
    });
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
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
          {this.renderList(this.state.regions)}
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
          {this.renderList(this.state.blocks)}
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

export default paramsToProps(ScreenBeaconInfo);
