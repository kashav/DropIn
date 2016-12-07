import React, { Component } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Modal from 'react-native-modalbox';
import { vw, vh, vmin, vmax } from 'react-native-viewport-units';

import * as courseUtils from '../../util/courses';

const RMP_QUERY_URL = 'https://www.ratemyprofessors.com/search.jsp?query=university+of+toronto';

export default class ClassModal extends Component {
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

  linkPressed(url) {
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) return Linking.openURL(url);
      }).catch(err => console.error('Couldn\'t open URL.'))
  }

  prepareLocationString(location) {
    let lat, lng;

    if (location && location.building && this.props.buildings.hasOwnProperty(location.building)) {
      let building = this.props.buildings[location.building];
      lat = building.lat;
      lng = building.lng;
    }

    let geo = !lat || !lng ? `geo:${43.6629},${-79.3957}` : `geo:${lat},${lng}`;

    return <Text style={styles.linkText} onPress={this.linkPressed.bind(this, geo)}>{location.hall}</Text>;
  }

  prepareInstructorsString(instructors) {
    if (instructors.length === 0)
      return null;

    return (
      <Text>
        {instructors.map((el, i) => (
          <Text key={i} style={styles.linkText} onPress={this.linkPressed.bind(this, `${RMP_QUERY_URL}+${el.split(' ').pop()}`)}>{el}</Text>
        )).reduce((a, b) => <Text>{a || '–'}, {b || '–'}</Text>)}
      </Text>
    );
  }

  render() {
    let { course } = this.state;
    let courseComponent;

    if (course) {
      let c, i, s, l, t;

      if (course.meeting_sections.length > 1) {
        c = course.meeting_sections.map(s => s.code).join(' / ');
        i = course.meeting_sections.map((s, i) => this.prepareInstructorsString(s.instructors)).reduce((a, b) => <Text>{a || '–'} / {b || '–'}</Text>);
        s = course.meeting_sections.map(s => `${s.enrolment}/${s.size} (${((s.enrolment/s.size) * 100).toFixed(1)}%)`).join(' / ');
        t = course.meeting_sections.map(s => `${courseUtils.formTimeString(s.times[0].start)} - ${courseUtils.formTimeString(s.times[0].end)}`).join(' / ');
        l = course.meeting_sections.map(s => this.prepareLocationString(s.times[0].location)).reduce((a, b) => <Text>{a || '–'} / {b || '–'}</Text>);
      } else {
        let { code, instructors, enrolment, size, times } = course.meeting_sections[0];
        let { location } = times[0];
        c = code;
        i = this.prepareInstructorsString(instructors) || '–';
        s = `${enrolment}/${size} (${((enrolment/size) * 100).toFixed(1)}%)`;
        l = this.prepareLocationString(location) || '–';
        t = `${courseUtils.formTimeString(times[0].start)} - ${courseUtils.formTimeString(times[0].end)}`;
      }

      courseComponent = (
        <ScrollView style={styles.courseView}>
          <View style={styles.courseViewContainer}>
            <Text style={styles.courseText}>
              <Text style={styles.headingText}>Course</Text>{`\n`}{course.code || '–'}{`\n\n`}
              <Text style={styles.headingText}>Title</Text>{`\n`}{course.name || '–'}{`\n\n`}
              <Text style={styles.headingText}>Description</Text>{`\n`}{course.description || '–'}{`\n\n`}
              <Text style={styles.meetingSection}>
                <Text style={styles.headingText}>Section</Text>{`\n`}{c.trim() || '–'}{`\n\n`}
                <Text style={styles.headingText}>Time</Text>{`\n`}{t.trim() || '–'}{`\n\n`}
                <Text style={styles.headingText}>Location</Text>{`\n`}{l || '–'}{`\n\n`}
                <Text style={styles.headingText}>Professor</Text>{`\n`}{i || '–'}{`\n\n`}
                <Text style={styles.headingText}>Enrolment</Text>{`\n`}{s.trim() || '–'}
              </Text>
            </Text>
          </View>
        </ScrollView>
      );
    }

    return (
      <Modal style={styles.modal} position={'center'} ref={'modal'} swipeToClose={false} backButtonClose={true}>
        {courseComponent}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    maxHeight: 60*vh,
    width: 90*vw,
  },
  courseView: {
    paddingHorizontal: 15,
  },
  courseViewContainer: {
    paddingTop: 15,
    paddingBottom: 20,
  },
  courseText: {
    color: 'black',
    fontSize: 14,
    lineHeight: 20,
  },
  headingText: {
    fontWeight: 'bold',
  },
  linkText: {
    textDecorationLine: 'underline'
  }
});
