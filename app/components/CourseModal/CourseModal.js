import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modalbox';

export default class CourseModal extends Component {
  constructor(props) {
    super(props);

    this.state = { course: null };
  }

  open(course) {
    if (!course)
      return;

    this.setState({ course });
    this.refs.modal.open();
  }

  render() {
    let { course } = this.state;
    console.log(course);

    return (
      <Modal
        style={styles.modal}
        position={'center'}
        ref={'modal'}
        swipeToClose={true}
        backButtonClose={true}>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 400,
    width: 300,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});
