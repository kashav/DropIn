import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as courseUtils from '../../util/courses';

export default class CurrentCourseList extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    });

    const currentCourses = courseUtils.findCurrentCourses(this.props.data, this.props.sort);

    this.state = {
      currentCourses,
      dataSource: ds.cloneWithRows(currentCourses.map((o, i) => i))
    };
  }

  renderRow(i) {
    let course = this.state.currentCourses[i];

    return (
      <View style={styles.listElement}>
        <Text style={styles.listElementText}>
          <Text style={styles.courseMain}>
            <Text style={styles.courseCode}>{course.code}: </Text>
            <Text style={styles.courseName}>{course.name}</Text>
          </Text>{`\n`}
          <Text style={styles.courseMeetingSections}>
            {course.meeting_sections.map((s, i) => (
              <Text key={i} style={styles.coureMeetingSection}>
                <Text style={styles.courseTime}>
                  {courseUtils.formTimeString(s.times[0].start)} - {courseUtils.formTimeString(s.times[0].end)}
                </Text>&nbsp;·&nbsp;
                <Text style={styles.courseLocation}>
                  {s.times[0].location}
                </Text>&nbsp;·&nbsp;
                <Text style={styles.enrolment}>
                  {s.enrolment}/{s.size} {`(${((s.enrolment/s.size) * 100).toFixed(1)}%)`}
                </Text>{`\n`}
              </Text>
            ))}
          </Text>
        </Text>
      </View>
    );
  }

  render() {
    if (this.state.currentCourses.length === 0) {
      return null;
    }
    return (
      <ListView
        style={styles.listView}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
      />
    );
  }
}

const styles = StyleSheet.create({
  listElement: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 0,
    marginVertical: 2.5,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    minHeight: 70
  },
  listElementText: {
    fontSize: 12,
    color: '#000',
  },
  courseMain: {
    lineHeight: 20,
  },
  courseCode: {
    fontWeight: 'bold'
  },
  courseName: {},
  courseMeetingSections: {
    fontSize: 11,
    color: '#424242',
    lineHeight: 20
  },
  courseTime: {
  }
});
