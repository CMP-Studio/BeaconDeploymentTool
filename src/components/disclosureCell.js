// @flow
/* eslint-disable global-require */
import React from 'react';

import { Text, View, TouchableHighlight, Image, StyleSheet } from 'react-native';

import { textColor, screenBackgroundColor, textSize } from '../styles';

const styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: screenBackgroundColor,
  },
  cellTitle: {
    flex: 1,
    marginLeft: 10,
    fontSize: textSize,
    color: textColor,
  },
  cellImage: {
    height: 44,
    width: 44,
  },
});

type DisclosureCellProps = {
  title: string,
  onPress: () => void,
};

const DisclosureCell = (props: DisclosureCellProps) => {
  return (
    <TouchableHighlight onPress={props.onPress}>
      <View style={styles.cell}>
        <Text style={styles.cellTitle}>
          {props.title}
        </Text>
        <Image style={styles.cellImage} source={require('../assets/DisclosureIndicator.png')} />
      </View>
    </TouchableHighlight>
  );
};

export default DisclosureCell;
