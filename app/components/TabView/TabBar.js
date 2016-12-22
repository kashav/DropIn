import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class TabBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIcons: []
    };
  }

  componentDidMount() {
    this.state.tabIcons[this.props.activeTab].setNativeProps({ style: { color: 'rgb(0, 42, 92)' } })
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue.bind(this));
  }

  componentWillUnmount() {
    this.props.scrollValue.removeListener(this.setAnimationValue.bind(this));
  }

  setAnimationValue({ value }) {
    this.state.tabIcons.forEach((icon, i) => {
      const progress = (value >= i && value < i + 1) ? value - i : ((value >= i - 1 && value < i) ? i - value : 1);
      icon.setNativeProps({ style: { color: this.iconColor(progress) } });
    });
  }

  iconColor(progress) {
    let red = 0 + (204 - 0) * progress;
    let green = 42 + (204 - 42) * progress;
    let blue = 92 + (204 - 92) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  render() {
    const tabWidth = this.props.containerWidth / this.props.tabs.length;
    const left = this.props.scrollValue.interpolate({ inputRange: [0, 1], outputRange: [0, tabWidth] });

    return (
      <View>
        <View style={[styles.tabs, this.props.style]}>
          {this.props.tabs.map((tab, i) => (
            <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
              <Icon
                name={tab}
                ref={icon => { this.state.tabIcons[i] = icon; }}
                size={30} />
            </TouchableOpacity>
          ))}
        </View>
        <Animated.View style={[styles.tabUnderlineStyle, { width: tabWidth }, { left } ]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    height: 50,
    flexDirection: 'row',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  tabUnderlineStyle: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgb(0, 42, 92)',
    bottom: 0,
  },
});
