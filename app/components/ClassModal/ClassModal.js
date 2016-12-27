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
      .then(supported => supported ? Linking.openURL(url) : null)
      .catch(err => console.error('Couldn\'t open URL.'))
  }

  normalizeText(text) {
    return text.replace(/&nbsp;/g, ' ')
               .replace(/&amp;/g, '&')
               .replace(/<br(\s|\/)*>/gm, '\n')
               .replace(/<(?:.|\n)*?>/gm, '')
  }

  prepareLocationString(room, location) {
    let geo = (location && location.lat && location.lng)
      ? `geo:${location.lat},${location.lng}`
      : `geo:${42.6629},${-79.3957}`;

    return <Text style={styles.linkText} onPress={this.linkPressed.bind(this, geo)}>{room}</Text>;
  }

  prepareInstructorsString(instructors) {
    if (instructors.length === 0)
      return null;

    return (
      <Text>
        {instructors.map((el, i) => (
          <Text key={i} style={styles.linkText} onPress={this.linkPressed.bind(this, `${RMP_QUERY_URL}+${el.lastName}`)}>{el.firstName}. {el.lastName}</Text>
        )).reduce((a, b) => <Text>{a || '–'}, {b || '–'}</Text>)}
      </Text>
    );
  }

  render() {
    let { course } = this.state;
    let courseComponent;

    if (course) {
      let c, i, e, l, t;

      if (course.meetings.length > 1) {
        c = course.meetings.map(m => `${m.teachingMethod}${m.sectionNumber}`).join(' / ');
        i = course.meetings.map((m, i) => this.prepareInstructorsString(m.instructors)).reduce((a, b) => <Text>{a || '–'} / {b || '–'}</Text>);
        e = course.meetings.map(m => `${m.actualEnrolment}/${m.enrollmentCapacity}  (${((m.actualEnrolment/m.enrollmentCapacity) * 100).toFixed(1)}%)`).join(' / ');
        t = course.meetings.map(m => `${courseUtils.formTimeString(m.schedule[0].meetingStartTime)} - ${courseUtils.formTimeString(m.schedule[0].meetingEndTime)}`).join(' / ');
        l = course.meetings.map(m => this.prepareLocationString(m.schedule[0].assignedRoom, m.schedule[0].meetingLocation)).reduce((a, b) => <Text>{a || '–'} / {b || '–'}</Text>);
      } else {
        let { teachingMethod, sectionNumber, instructors, actualEnrolment, enrollmentCapacity, schedule } = course.meetings[0];
        let { meetingLocation, assignedRoom } = schedule[0];
        c = `${teachingMethod}${sectionNumber}`;
        i = this.prepareInstructorsString(instructors) || '–';
        e = `${actualEnrolment}/${enrollmentCapacity} (${((actualEnrolment/enrollmentCapacity) * 100).toFixed(1)}%)`;
        l = this.prepareLocationString(assignedRoom, meetingLocation) || '–';
        t = `${courseUtils.formTimeString(schedule[0].meetingStartTime)} - ${courseUtils.formTimeString(schedule[0].meetingEndTime)}`;
      }

      courseComponent = (
        <ScrollView style={styles.courseView}>
          <View style={styles.courseViewContainer}>
            <Text style={styles.courseText}>
              <Text style={styles.headingText}>Course</Text>{`\n`}{course.code || '–'}{`\n\n`}
              <Text style={styles.headingText}>Title</Text>{`\n`}{course.courseTitle || '–'}{`\n\n`}
              <Text style={styles.headingText}>Description</Text>{`\n`}{this.normalizeText(course.courseDescription) || '–'}{`\n\n`}
              <Text style={styles.meetingSection}>
                <Text style={styles.headingText}>Section</Text>{`\n`}{c.trim() || '–'}{`\n\n`}
                <Text style={styles.headingText}>Time</Text>{`\n`}{t.trim() || '–'}{`\n\n`}
                <Text style={styles.headingText}>Location</Text>{`\n`}{l || '–'}{`\n\n`}
                <Text style={styles.headingText}>Professor</Text>{`\n`}{i || '–'}{`\n\n`}
                <Text style={styles.headingText}>Enrolment</Text>{`\n`}{e.trim() || '–'}
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
