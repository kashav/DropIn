import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { vw, vh, vmin, vmax } from 'react-native-viewport-units';

export default function ErrorCard() {
  return (
      <View style={[styles.errorView]}>
        <View style={[styles.errorCard]}>
          <Text style={styles.errorText}>
            <Text style={styles.errorTextBig}>Oops!</Text>{'\n\n\n'}An unexpected error has occurred. Try again later.
          </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorView: {
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
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    marginBottom: 20,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  errorText: {
    color: '#000',
    fontSize: 12,
    textAlign: 'center'
  },
  errorTextBig: {
    fontSize: 16,
    fontWeight: 'bold'
  },
});
