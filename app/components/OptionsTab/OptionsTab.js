import React, { Component } from 'react';
import {
  DatePickerAndroid,
  StyleSheet,
  Text,
  TimePickerAndroid,
  TouchableOpacity,
  View
} from 'react-native';

import { ALL_DAYS, ALL_DAYS_ABBR, SORT_METHODS } from '../../constants';

export default class OptionsTab extends Component {
  constructor(props) {
    super(props);

    let now = new Date();
    let day = now.getDay();

    this.state = {
      day: now.getDay(),
      hour: now.getHours(),
      minute: now.getMinutes(),
    };
  }

  showDatePicker = async (stateKey, options) => {
    let { action, year, month, day } = await DatePickerAndroid.open(options);

    if (action === DatePickerAndroid.dismissedAction)
      return;

    day = (new Date(year, month, day)).getDay()

    this.setState({ day });
    this.props.setDay(day);
  };

  showTimePicker = async (stateKey, options) => {
    let { action, minute, hour } = await TimePickerAndroid.open(options);

    if (action !== TimePickerAndroid.timeSetAction)
      return;

    this.setState({ hour, minute });
    this.props.setTime(hour + (minute / 60));
  };

  formatTime(hour, minute) {
    let h = hour === 0 ? '12' : hour > 12 ? hour - 12 : hour;
    let m = minute < 10 ? `0${minute}` : minute;
    let p = hour < 12 ? 'AM' : 'PM';
    return `${h}:${m} ${p}`;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.optionContainer}>
          <Text style={styles.headingText}>Sort method{'\n'}</Text>
          <TouchableOpacity delayPressIn={0} onPress={() => this.props.setSortIndex(this.props.sort === SORT_METHODS.length - 1 ? 0 : this.props.sort + 1)}>
            <View><Text style={styles.optionText}>{SORT_METHODS[this.props.sort]}</Text></View>
          </TouchableOpacity>
        </View>
        <View style={styles.optionContainer}>
          <Text style={styles.headingText}>Day / Time{'\n'}</Text>
          <View style={styles.dayTimeContainer}>
            <TouchableOpacity delayPressIn={0} onPress={this.showDatePicker.bind(this, 'all', { date: new Date(), minDate: new Date(), maxDate: new Date(2017, 3, 31) })}>
              <View><Text style={styles.optionText}>{ALL_DAYS[this.state.day]}</Text></View>
            </TouchableOpacity>
            <Text style={[styles.optionText, styles.dayTimeDivider]}> / </Text>
            <TouchableOpacity delayPressIn={0} onPress={this.showTimePicker.bind(this, 'all', { is24Hour: false })}>
              <View><Text style={styles.optionText}>{this.formatTime(this.state.hour, this.state.minute)}</Text></View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    padding: 20,
  },
  optionContainer: {
    marginVertical: 7,
  },
  dayTimeContainer: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',
  },
  text: {
    color: '#000',
  },
  headingText: {
    fontFamily: 'sans-serif-condensed',
    fontSize: 17,
    color: '#000',
  },
  optionText: {
    fontFamily: 'sans-serif-thin',
    fontSize: 34,
    color: '#000',
  },
});
