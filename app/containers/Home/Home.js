import React, { Component } from 'react';
import { StatusBar, StyleSheet, ToastAndroid, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { vw, vh, vmin, vmax } from 'react-native-viewport-units';

import * as classActions from '../../actions/classActions';
import CurrentClassList from '../../components/CurrentClassList';
import EmptyRoomList from '../../components/EmptyRoomList'
import ErrorCard from '../../components/ErrorCard';
import InfoPanel from '../../components/InfoPanel';
import TabView from '../../components/TabView';
import Toolbar from '../../components/Toolbar';
import { SORT_METHODS } from '../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#efefef',
  },
  tab: {
    flex: 1,
    padding: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.01)',
  },
});

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { title: 'Drop-In', activeTab: 0 };
  }

  componentWillMount() {
    let { classActions, state } = this.props;
    classActions.findCurrentCourses(state.data, state.classes);
  }

  toggleSort() {
    let { classActions, state } = this.props;

    classActions.toggleSort();
    this.classList.reloadData();

    ToastAndroid.show(
      `Sorting by ${( (state.classes.sort + 1) === SORT_METHODS.length
        ? SORT_METHODS[0]
        : SORT_METHODS[state.classes.sort+1]).toLowerCase()}`,
      ToastAndroid.SHORT);
  }

  render() {
    const { state } = this.props;

    if (!state.data || !state.data.buildings || !state.data.courses || !state.classes.current) {
      return (
        <View style={{flex: 1}}>
          <Spinner visible={true} size={'large'} color={'rgb(0, 42, 92)'} overlayColor={'#efefef'}/>
        </View>
      );
    }

    let component;

    if (state.error !== null) {
      component = <ErrorCard />;
    } else {
      component = (
        <TabView onChangeTab={({ i, ref }) => this.setState({ activeTab: i })}>
          <View tabLabel='class' style={styles.tab}>
            <CurrentClassList
              data={state.data}
              classes={state.classes}
              ref={classList => { this.classList = classList; }}
              {...this.props.classActions} />
          </View>
          <View tabLabel='lock-open' style={styles.tab}>
            <EmptyRoomList />
          </View>
          <View tabLabel='info-outline' style={styles.tab}>
            <InfoPanel />
          </View>
        </TabView>
      );
    }

    return (
      <View style={styles.container}>
        <StatusBar />
        <Toolbar title={this.state.title} showActions={!this.props.error && this.state.activeTab === 0} onToggleSort={() => this.toggleSort()} />
        {component}
      </View>
    );
  }
}

export default connect(
  state => ({ state }),
  dispatch => ({ classActions: bindActionCreators(classActions, dispatch) })
)(Home);
