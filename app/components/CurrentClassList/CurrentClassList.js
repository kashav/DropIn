import React, { Component } from 'react';
import {
  ListView,
  RecyclerViewBackedScrollView,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
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
      data: props.classes.current,
      dataSource: ds.cloneWithRows(props.classes.current || []),
      searchText: '',
      searching: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.classes && nextProps.classes.current) {
      this.setState({
        data: nextProps.classes.current || [],
        dataSource: this.state.dataSource.cloneWithRows(nextProps.classes.current || []),
        searching: true,
      }, () => this.handleSearch());
    }
  }

  setSearchText(event) {
    event.persist();
    let searchText = event.nativeEvent.text.toLowerCase().trim();

    if (searchText === this.state.searchText)
      return;

    this.setState({ searchText, searching: true }, () => this.handleSearch());
  }

  handleSearch() {
    let { dataSource, data, searchText } = this.state;

    if (searchText.length < 3)
      return this.setState({ dataSource: dataSource.cloneWithRows(data) });

    // Filter a deep-cloned version of data
    let filteredData = JSON.parse(JSON.stringify(data)).filter(row => {
      if ([row.code, row.courseDescription, row.courseTitle, row.orgName].some(x => x && x.toLowerCase().includes(searchText)))
        return true;

      if (row.meetings.map(m => m.instructors.map(i => i.lastName).join(' ')).join(' ').toLowerCase().includes(searchText))
        return true;

      if (row.meetings.map(m => m.schedule.map(s => s.assignedRoom).join(' ')).join(' ').toLowerCase().includes(searchText))
        return true;

      return false;
    });

    this.setState({
      dataSource: dataSource.cloneWithRows(filteredData),
      searching: false,
    });
  }

  renderRow(rowData, sectionId, rowId, highlightRow) {
    let course = rowData;

    return (
      <View style={styles.listElement}>
        <TouchableHighlight
          onPress={() => {
            this.modal.open(course);
            highlightRow(sectionId, rowId);
          }}
          underlayColor={'#fff'}>
          <Text style={styles.listElementText}>
            <Text style={styles.courseMain}>
              <Text style={styles.courseCode}>{course.code}: </Text>
              <Text style={styles.courseName}>{course.courseTitle}</Text>
            </Text>{`\n`}
            <Text style={styles.courseMeetingSections}>
              {course.meetings.map((m, i) => {
                let hasTime = m.schedule[0] && m.schedule[0].meetingStartTime && m.schedule[0].meetingEndTime;
                let hasLocation = m.schedule[0] && m.schedule[0].assignedRoom;
                let hasSize = m.actualEnrolment && m.enrollmentCapacity;

                return (
                  <Text key={i} style={styles.coureMeetingSection}>
                    {hasTime && <Text style={styles.courseTime}>{courseUtils.formTimeString(m.schedule[0].meetingStartTime)} - {courseUtils.formTimeString(m.schedule[0].meetingEndTime)}</Text>}
                    {hasTime && hasLocation && <Text>&nbsp;·&nbsp;</Text>}
                    {hasLocation && <Text style={styles.courseLocation}>{m.schedule[0].assignedRoom}</Text>}
                    {((hasLocation && hasSize) || (hasTime && hasSize)) && <Text>&nbsp;·&nbsp;</Text>}
                    {hasSize && <Text style={styles.enrolment}>{m.actualEnrolment}/{m.enrollmentCapacity} {`(${((m.actualEnrolment/m.enrollmentCapacity) * 100).toFixed(1)}%)`}{`\n`}</Text>}
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
        color={'rgb(0, 42, 92)'}
        enabled={false}
        onRefresh={this.props.reloadData.bind(this)}
        refreshing={this.props.refreshing}
      />
    );

    if (!this.props.classes || !this.props.classes.current || this.props.classes.current.length === 0) {
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
        <ClassModal ref={modal => { this.modal = modal; }}/>
        <View style={styles.contentContainer}>
          <TextInput
            onChange={this.setSearchText.bind(this)}
            onBlur={() => {this.modal.isOpen && this.modal.close()}}
            placeholder={'Search'}
            style={styles.searchBar}
            underlineColorAndroid={'rgba(0,0,0,0)'}
            value={this.state.searchText} />
          <ListView
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            refreshControl={refreshControl}
            renderRow={this.renderRow.bind(this)}
            renderSeparator={this.renderSeparator.bind(this)}
            style={styles.listView} />
        </View>
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
    flex: 1,
  },
  contentContainer: {
    zIndex: -1,
  },
  searchBar: {
    backgroundColor: 'transparent',
    padding: 5,
    paddingLeft: 15,
    color: '#000',
    height: 50,
    fontFamily: 'sans-serif-light',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  listView: {
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
  courseTime: {},
});
