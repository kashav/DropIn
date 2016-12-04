import React, { Component } from 'react';
import {
  ListView,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ScrollView,
} from 'react-native';

import * as courseUtils from '../../util/courses';

export default class CurrentClassList extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const currentCourses = courseUtils.findCurrentCourses(JSON.parse(JSON.stringify(this.props.data)), this.props.sort);

    this.state = {
      currentCourses,
      dataSource: ds.cloneWithRows(Object.keys(currentCourses)),
      refreshing: false
    };
  }

  resort(sort) {
    let { currentCourses, dataSource: ds } = this.state;

    this.setState({ currentCourses: [], dataSource: ds.cloneWithRows([]) }, () => {
      currentCourses = courseUtils.sort(JSON.parse(JSON.stringify(Object.values(currentCourses))), sort);
      ds = ds.cloneWithRows(Object.keys(currentCourses));

      this.setState({ currentCourses, dataSource: ds });
    });
  }

  onRefresh() {
    let { currentCourses, dataSource: ds } = this.state;

    this.setState({ refreshing: true, currentCourses: [], dataSource: ds.cloneWithRows([]) }, () => {
      currentCourses = courseUtils.findCurrentCourses(JSON.parse(JSON.stringify(this.props.data)), this.props.sort);
      ds = this.state.dataSource.cloneWithRows(Object.keys(currentCourses));

      this.setState({ currentCourses, dataSource: ds, refreshing: false });
    });
  }

  renderRow(id) {
    let course = this.state.currentCourses[id];

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
    if (Object.keys(this.state.currentCourses).length === 0) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
              color={'rgb(0, 42, 92)'}
            />
          }>
          <Text style={[styles.listElement, styles.noResultsElement]}>
            <Text style={styles.listElementText}>No classes going on right now! Check back later.</Text>
          </Text>
        </ScrollView>
      );
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
            color={'rgb(0, 42, 92)'}
          />
        }
        renderRow={this.renderRow.bind(this)}
        style={styles.listView}
      />
    );
  }
}

const styles = StyleSheet.create({
  noResultsElement: {
    textAlign: 'center',
    margin: 0,
    padding: 20,
    minHeight: 0
  },
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
    color: '#000',
  },
  courseMain: {
    lineHeight: 20,
    fontSize: 13,
  },
  courseCode: {
    fontWeight: '500'
  },
  courseName: {},
  courseMeetingSections: {
    lineHeight: 25,
    fontFamily: 'sans-serif-light',
    fontSize: 12.5,
  },
  courseTime: {
  }
});
