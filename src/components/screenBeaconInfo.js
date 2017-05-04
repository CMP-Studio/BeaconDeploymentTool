// @flow
import React, { Component } from 'react';
import {
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  View,
  Text,
  Modal,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { List } from 'immutable';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import type {
  BeaconType,
  BeaconIDType,
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
  listSeparatorColor,
  listHeaderColor,
  modalBackgroundColor,
  headerTextSize,
  headerFontWeight,
  headerBackgroundColor,
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
  rowListHeader: {
    backgroundColor: listHeaderColor,
    // TODO: Fix this latter...
    paddingHorizontal: 10,
    marginHorizontal: -10,
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
  modalContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: modalBackgroundColor,
  },
  modalBox: {
    height: '70%',
    width: '85%',
    borderRadius: 20,
    backgroundColor: screenBackgroundColor,
    overflow: 'hidden',
  },
  modalHeader: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: headerBackgroundColor,
    borderBottomColor: listSeparatorColor,
    borderBottomWidth: 1,
  },
  modalHeaderText: {
    textAlign: 'center',
    fontSize: headerTextSize,
    fontWeight: headerFontWeight,
  },
});

const REGIONS_MODAL = 'REGIONS_MODAL';
const BLOCKS_MODAL = 'BLOCKS_MODAL';
type ModalType = 'REGIONS_MODAL' | 'BLOCKS_MODAL';

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

    this.removeListItem.bind(this);
    this.setModalVisible.bind(this);
    this.renderModal.bind(this);

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
        modalVisible: false,
      };
    } else {
      this.state = {
        name: 'Unnamed',
        uuid: 'None',
        floor: 'Unassigned',
        regions: List(),
        blocks: List(),
        modalVisible: false,
      };
    }
  }

  state: {
    prevUuid?: BeaconIDType,
    name: string,
    uuid: BeaconIDType,
    floor: string,
    regions: List<BeaconIDType>,
    blocks: List<BeaconIDType>,
    modalVisible: Boolean,
    modalType: ?ModalType,
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
    beaconUuid: BeaconIDType,
    allBeacons: Array<BeaconType>,
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

  setModalVisible(visible, modalType) {
    this.setState(() => {
      return {
        modalType: modalType || null,
        modalVisible: visible,
      };
    });
  }

  removeListItem(list, listItem) {
    let newList = list === 'regions' ? this.state.regions : this.state.blocks;

    const indexToRemove = newList.indexOf(listItem);
    if (indexToRemove === -1) {
      return;
    }

    newList = newList.delete(indexToRemove);

    const newBeacon = Beacon({
      name: this.state.name,
      uuid: this.state.uuid,
      floor: this.state.floor,
      regions: list === 'regions' ? newList : this.state.regions,
      blocks: list === 'blocks' ? newList : this.state.blocks,
    });

    this.props.updateBeacon(newBeacon);
  }

  renderList(listData) {
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
        </View>
      );
    });
  }

  renderModal() {
    const modalType = this.state.modalType;

    let headerTitle;

    switch (modalType) {
      case REGIONS_MODAL: {
        headerTitle = 'Edit Regions';
        break;
      }

      case BLOCKS_MODAL: {
        headerTitle = 'Edit Blocks';
        break;
      }
      // no default
    }

    return (
      <Modal animationType={'slide'} transparent={true} visible={this.state.modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => {
            // TODO: DOES save
            this.setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 0.25 }}>
                    <Button
                      title="Cancel"
                      color={activeColor}
                      onPress={() => {
                        // TODO: Does NOT save
                        this.setModalVisible(false);
                      }}
                    />
                  </View>
                  <View style={{ flex: 0.5 }}>
                    <Text style={styles.modalHeaderText}>{headerTitle}</Text>
                  </View>
                  <View style={{ flex: 0.25 }}>
                    <Button
                      title="Done"
                      color={activeColor}
                      onPress={() => {
                        // TODO: DOES save
                        this.setModalVisible(false);
                      }}
                    />
                  </View>
                </View>
                <View style={styles.modalBody}>
                  <Text>Hello World!</Text>

                  <TouchableOpacity
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}
                  >
                    <Text>Hide Modal</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }

  render() {
    const editListButton = (editMessage, onPress) => {
      return (
        <TouchableOpacity onPress={onPress}>
          <Text style={{ color: activeColor, fontSize: textSize }}>
            {editMessage}
          </Text>
        </TouchableOpacity>
      );
    };

    return (
      <View style={{ flex: 1 }}>
        {this.renderModal()}
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
            <View style={[styles.row, styles.rowListHeader]}>
              <View style={styles.rowTitleItem}>
                <Text style={styles.rowHeaderText}>Regions</Text>
              </View>
              <View style={styles.rowDataItem}>
                {editListButton('Edit Regions', () => {
                  this.setModalVisible(true, REGIONS_MODAL);
                })}
              </View>
            </View>
            {this.renderList(this.state.regions, 'regions')}
            <View style={[styles.row, styles.rowListHeader]}>
              <View style={styles.rowTitleItem}>
                <Text style={styles.rowHeaderText}>Blocks</Text>
              </View>
              <View style={styles.rowDataItem}>
                {editListButton('Edit Blocks', () => {
                  this.setModalVisible(true, BLOCKS_MODAL);
                })}
              </View>
            </View>
            {this.renderList(this.state.blocks, 'blocks')}
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default paramsToProps(ScreenBeaconInfo);
