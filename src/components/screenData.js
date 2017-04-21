import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
});

const ScreenData = (props) => {
  return (
    <View style={styles.container}>
      <Text>
        {props.text}
      </Text>
    </View>
  );
};

ScreenData.navigationOptions = {
  title: 'Data',
  headerLeft: (
    <Button
      title="Import"
      onPress={() => {
        console.log('Import Data');
      }}
    />
  ),
  headerRight: (
    <Button
      title="Export"
      onPress={() => {
        console.log('Export Data');
      }}
    />
  ),
};

export default ScreenData;
