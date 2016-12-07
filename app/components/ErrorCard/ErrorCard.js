import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-viewport-units';

export default function ErrorCard() {
  return (
      <View style={[styles.errorContainer]}>
        <View style={[styles.errorView]}>
          <Text style={styles.errorText}>
            <Text style={styles.errorTextBig}>Oops!</Text>{'\n\n\n'}An unexpected error has occurred. Try again later.
          </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
    justifyContent: 'center',
  },
  errorCard: {
    height: 30*vh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderTopWidth: 0,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  errorText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 13,
  },
  errorTextBig: {
    fontSize: 15,
    fontWeight: 'bold'
  },
});
