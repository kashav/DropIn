import React, { Component } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

export default class InfoPanel extends Component {
  linkPressed(url) {
    Linking.openURL(url);
  }

  render() {
    return (
      <View style={styles.card}>
        <Text style={styles.text}>
          <Text>Built by <Text style={styles.linkText} onPress={() => this.linkPressed('http://kshvmdn.com')}>Kashav Madan</Text>.</Text>{`\n\n`}
          Find a bug or have a feature request? File an issue on <Text style={styles.linkText} onPress={() => this.linkPressed('https://github.com/kshvmdn/dropin')}>GitHub</Text>.{`\n\n`}
          <Text style={styles.highlightText}>Drop-In</Text> is powered by <Text style={styles.linkText} onPress={() => this.linkPressed('https://cobalt.qas.im')}>Cobalt</Text>.{`\n\n\n\n`}
          This app is in no way affiliated with the University of Toronto.
        </Text>
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
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  text: {
    color: '#000',
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  highlightText: {
    color: 'rgb(0, 42, 92)',
  },
})
