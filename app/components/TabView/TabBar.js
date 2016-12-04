import React, { Component, PropTypes } from 'react';
import {
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
    this._listener = this.props.scrollValue.addListener(this.setAnimationValue.bind(this));
  }

  setAnimationValue({ value }) {
    this.state.tabIcons.forEach((icon, i) => {
      const progress = Math.min(1, Math.abs(value - i))
      icon.setNativeProps({ style: { color: this.iconColor(progress) } });
    });
  }

  iconColor(progress) {
    const red = 0 + (204 - 0) * progress;
    const green = 42 + (204 - 42) * progress;
    const blue = 92 + (204 - 92) * progress;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  render() {
    return (
      <View style={[styles.tabs, this.props.style]}>
        {this.props.tabs.map((tab, i) => (
          <TouchableOpacity key={tab} onPress={() => this.props.goToPage(i)} style={styles.tab}>
            <Icon
              name={tab}
              size={25}
              color={this.props.activeTab === i ? 'rgb(0, 42, 92)' : 'rgb(204, 204, 204)'}
              ref={(icon) => { this.state.tabIcons[i] = icon; }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}

TabBar.propTypes = {
  goToPage: PropTypes.func,
  activeTab: PropTypes.number,
  tabs: PropTypes.array
};

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  tabs: {
    height: 45,
    flexDirection: 'row',
    paddingTop: 5,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
});
