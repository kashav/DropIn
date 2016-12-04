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
      <View style={styles.card}>
        <Text style={styles.text}>Coming soon...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 20,
    marginTop: 2.5,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  text: {
    fontSize: 11.5,
    color: '#000',
    textAlign: 'center',
  }
});
