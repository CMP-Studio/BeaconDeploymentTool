// @flow
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type ScreenDataProps = {
  text: string,
};

const ScreenData = (props: ScreenDataProps) => {
  return (
    <View style={styles.container}>
      <Text>
        Coming Soon
      </Text>
    </View>
  );
};

ScreenData.navigationOptions = {
  title: 'Data',
};

export default ScreenData;
