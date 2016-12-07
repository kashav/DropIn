import React, { Component } from 'react';
import {
  ListView,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as courseUtils from '../../util/courses';

export default class EmptyRoomList extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Coming soon...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 20,
  },
  text: {
    color: '#000',
    textAlign: 'center',
  }
});
