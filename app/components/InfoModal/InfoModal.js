import React, { Component } from 'react';
import { Linking, Modal, StyleSheet, Text, TouchableHighlight, TouchableWithoutFeedback, View } from 'react-native';
import { VERSION } from '../../constants';

export default class InfoModal extends Component {
  constructor() {
    super();

    this.state = {
      modalVisible: false,
      buttonActive: false,
    }
  }

  linkPressed(url) {
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported)
          return Linking.openURL(url);
      }).catch(err => console.error('Couldn\'t open URL.'))
  }

  onButtonHighlight() {
    this.setState({ buttonActive: true });
  };

  onButtonUnhighlight() {
    this.setState({ buttonActive: false });
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  };

  render() {
    return (
      <View>
        <Modal
          transparent={true}
          animationType={'fade'}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={this.setModalVisible.bind(this, false)}>
            <View style={styles.container}>
              <TouchableWithoutFeedback>
                <View style={styles.innerContainer}>
                  <Text style={styles.text}>
                    <Text style={styles.heading}>Help & Feedback</Text>{`\n\n`}
                    <Text style={styles.body}>
                      <Text>Built by <Text style={styles.link} onPress={this.linkPressed.bind(this, 'http://kshvmdn.com')}>Kashav Madan</Text>.</Text>{`\n\n`}
                      <Text>Bug or feature request? <Text style={styles.link} onPress={this.linkPressed.bind(this, `mailto:kshvmdn@gmail.com?subject=Drop-In v${VERSION} – Bug/Feature request`)}>Let us know!</Text></Text>{`\n\n`}
                      <Text style={styles.disclaimer}>This application is in no way affiliated with the University of Toronto.</Text>
                    </Text>
                  </Text>

                  <TouchableHighlight
                    onHideUnderlay={this.onButtonUnhighlight.bind(this)}
                    onPress={this.setModalVisible.bind(this, false)}
                    onShowUnderlay={this.onButtonHighlight.bind(this)}
                    style={styles.button}
                    underlayColor="#a9d9d4">
                    <Text style={[styles.buttonText]}>CLOSE</Text>
                  </TouchableHighlight>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)' ,
  },
  innerContainer: {
    backgroundColor: '#fff',
    borderRadius: 2,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 18,
  },
  text: {
    color: '#000',
  },
  heading: {
    fontFamily: 'sans-serif-medium',
    fontSize: 16,
  },
  body: {
    fontSize: 14,
  },
  name: {
    fontSize: 13,
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  link: {
    textDecorationLine: 'underline',
  },
  highlight: {
    color: 'rgb(0, 42, 92)',
  },
  button: {
    borderRadius: 5,
    flexGrow: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 13,
    textAlign: 'right',
    color: 'rgb(0, 42, 92)',
    margin: 5,
    marginTop: 15,
    marginBottom: 0,
  },
})
