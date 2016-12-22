import React, { Component } from 'react';
import { StatusBar, StyleSheet, ToastAndroid, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import * as dataActions from '../../actions/dataActions';
import * as classActions from '../../actions/classActions';
import * as optionActions from '../../actions/optionActions';

import CurrentClassList from '../../components/CurrentClassList';
import EmptyRoomList from '../../components/EmptyRoomList'
import InfoModal from '../../components/InfoModal';
import OptionsTab from '../../components/OptionsTab';
import TabView from '../../components/TabView';
import Toolbar from '../../components/Toolbar';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: 'Drop-In',
      activeTab: 0,
      refreshing: false,
      loading: true,
    };
  }

  componentWillMount() {
    let { classActions, state } = this.props;

    if (state.error)
      return this.setState({ loading: false });

    classActions.parseCourseData(state.data, { sort: state.options.sort }, () => {
      this.setState({ loading: false });
    });
  }

  reload() {
    let { classActions, dataActions, state: { options: { day, time } } } = this.props;

    this.setState({ refreshing: true }, () => {
      dataActions.fetchData({ day, time }).then(() => {
        classActions.parseCourseData(this.props.state.data, this.props.state.options, () => {
          this.setState({ refreshing: false });
        });
      });
    });
  }

  showInfoModal() {
    this.infoModal.setModalVisible(true);
  }

  render() {
    const { state } = this.props;

    if (state.loading) {
      return (
        <View style={{flex: 1}}>
          <Spinner visible={true} size={'large'} color={'rgb(0, 42, 92)'} overlayColor={'#efefef'}/>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <InfoModal ref={modal => { this.infoModal = modal; }}/>
        <StatusBar />
        <Toolbar
          title={this.state.title}
          reload={this.reload.bind(this)}
          showInfoModal={this.showInfoModal.bind(this)} />
        <TabView onChangeTab={({ i, ref }) => this.setState({ activeTab: i })}>
          <View tabLabel='school' style={styles.tab}>
            <CurrentClassList
              data={state.data}
              classes={state.classes}
              options={state.options}
              reloadData={this.reload.bind(this)}
              ref={classList => { this.classList = classList; }}
              refreshing={this.state.refreshing}
              {...this.props.classActions} />
          </View>
          {/* <View tabLabel='room' style={styles.tab}>
            <EmptyRoomList />
          </View> */}
          <View tabLabel='settings' style={styles.tab}>
            <OptionsTab
              sort={state.options.sort}
              {...this.props.optionActions} />
          </View>
        </TabView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    padding: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderLeftWidth: 0.5,
    borderLeftColor: 'rgba(0, 0, 0, 0.3)',
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(0, 0, 0, 0.3)',
  },
});

export default connect(
  state => ({ state }),
  dispatch => ({
    classActions: bindActionCreators(classActions, dispatch),
    dataActions: bindActionCreators(dataActions, dispatch),
    optionActions: bindActionCreators(optionActions, dispatch),
  })
)(Home);
