import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  ActivityIndicator,
  ViewPagerAndroid,
  Button,
  View,
} from 'react-native';

import TabItem from '../compoents/TabItem';
import ViewPager from '../compoents/ViewPager';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class Movie extends React.PureComponent {
    static navigationOptions = {
        tabBar: {
            icon: ({ focused,tintColor }) => <TabItem label="影视" tintColor={tintColor} />,
        },
    }
    state = {
    index: 0,
    routes: [
      { key: '1', title: 'First' },
      { key: '2', title: 'Second' },
    ],
  };

  _handleChangeTab = (index) => {
    this.setState({ index });
  };

  _renderHeader = (props) => {
    return <TabBar scrollEnabled={true} {...props} />;
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
    case '1':
      return <View style={[ styles.page, { backgroundColor: '#ff4081' } ]} />;
    case '2':
      return <View style={[ styles.page, { backgroundColor: '#673ab7' } ]} />;
    default:
      return null;
    }
  };

  render() {
    return (
      <TabViewAnimated
        lazy={true}
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onRequestChangeTab={this._handleChangeTab}
      />
    );
  }
}