import React, { Component } from 'react';
import {
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
} from 'react-native';

import CourseModal from '../CourseModal';
import * as courseUtils from '../../util/courses';

export default class CurrentClassList extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const currentCourses = courseUtils.findCurrentCourses(JSON.parse(JSON.stringify(this.props.courses)), this.props.sort);

    this.state = {
      currentCourses,
      dataSource: ds.cloneWithRows(Object.keys(currentCourses)),
      refreshing: false,
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
      currentCourses = courseUtils.findCurrentCourses(JSON.parse(JSON.stringify(this.props.courses)), this.props.sort);
      ds = this.state.dataSource.cloneWithRows(Object.keys(currentCourses));

      this.setState({ currentCourses, dataSource: ds, refreshing: false });
    });
  }

  renderRow(rowData, sectionId, rowId, highlightRow) {
    let course = this.state.currentCourses[rowData];

    return (
      <View style={styles.listElement}>
        <TouchableHighlight
          onPress={() => {
            this.modal.open(course);
            highlightRow(sectionId, rowId);
          }}
          underlayColor={'#fff'}
        >
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
                    {s.times[0].location.hall}
                  </Text>&nbsp;·&nbsp;
                  <Text style={styles.enrolment}>
                    {s.enrolment}/{s.size} {`(${((s.enrolment/s.size) * 100).toFixed(1)}%)`}
                  </Text>{`\n`}
                </Text>
              ))}
            </Text>
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderSeparator(sectionId, rowId, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionId}-${rowId}`}
        style={{
          height: StyleSheet.hairlineWidth + (adjacentRowHighlighted ? 0.25 : 0),
          backgroundColor: adjacentRowHighlighted ? 'rgb(0, 42, 92)' : '#8e8e8e',
        }}
      />
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
      <View>
        <CourseModal ref={modal => { this.modal = modal; }} buildings={this.props.buildings}/>
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
          renderSeparator={this.renderSeparator.bind(this)}
          style={styles.listView} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  noResultsElement: {
    textAlign: 'center',
    minHeight: 0
  },
  listView: {
    zIndex: -1,
    minHeight: 500,
  },
  listElement: {
    backgroundColor: '#fff',
    padding: 15,
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
  },
});
