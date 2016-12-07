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

import ClassModal from '../ClassModal';
import * as courseUtils from '../../util/courses';

export default class CurrentClassList extends Component {
  constructor(props) {
    super(props);

    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      currentData: props.classes.current,
      dataSource: ds.cloneWithRows(Object.keys(props.classes.current)),
      refreshing: false,
    };
  }

  reloadData() {
    this.setState({ refreshing: true }, () => {
      this.props.findCurrentCourses(this.props.data, this.props.classes);

      setTimeout(() => {
        this.setState({
          currentData: this.props.classes.current,
          dataSource: this.state.dataSource.cloneWithRows(Object.keys(this.props.classes.current)),
          refreshing: false
        });
      }, 2000)
    });
  }

  renderRow(rowData, sectionId, rowId, highlightRow) {
    let course = this.state.currentData[rowData];

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
              {course.meeting_sections.map((s, i) => {
                let hasTime = s.times[0] && s.times[0].start && s.times[0].end;
                let hasLocation = s.times[0] && s.times[0].location && s.times[0].location.hall;
                let hasSize = s.enrolment && s.size && s.size !== 9999;

                return (
                  <Text key={i} style={styles.coureMeetingSection}>
                    {hasTime && <Text style={styles.courseTime}>{courseUtils.formTimeString(s.times[0].start)} - {courseUtils.formTimeString(s.times[0].end)}</Text>}
                    {hasTime && hasLocation && <Text>&nbsp;·&nbsp;</Text>}
                    {hasLocation && <Text style={styles.courseLocation}>{s.times[0].location.hall}</Text>}
                    {((hasLocation && hasSize) || (hasTime && hasSize)) && <Text>&nbsp;·&nbsp;</Text>}
                    {hasSize && <Text style={styles.enrolment}>{s.enrolment}/{s.size} {`(${((s.enrolment/s.size) * 100).toFixed(1)}%)`}{`\n`}</Text>}
                  </Text>
                );
              })}
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
          backgroundColor: adjacentRowHighlighted ? 'rgb(0, 42, 92)' : 'rgba(0, 0, 0, 0.3)',
        }}
      />
    );
  }

  render() {
    let refreshControl = (
      <RefreshControl
        refreshing={this.state.refreshing}
        onRefresh={this.reloadData.bind(this)}
        color={'rgb(0, 42, 92)'}
      />
    );

    if (!this.props.classes.current || Object.keys(this.props.classes.current).length === 0) {
      return (
        <ScrollView style={styles.container} refreshControl={refreshControl}>
          <Text style={[styles.listElement, styles.noResultsElement]}>
            <Text style={styles.listElementText}>No classes going on right now! Check back later.</Text>
          </Text>
        </ScrollView>
      );
    }

    return (
      <View style={styles.container}>
        <ListView
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          refreshControl={refreshControl}
          renderRow={this.renderRow.bind(this)}
          renderSeparator={this.renderSeparator.bind(this)}
          style={styles.listView} />
          <ClassModal ref={modal => { this.modal = modal; }} buildings={this.props.data.buildings}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  noResultsElement: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 20,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    minHeight: 0,
  },
  container: {
  },
  listView: {
    zIndex: -1,
  },
  listElement: {
    backgroundColor: '#fff',
    padding: 15,
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
