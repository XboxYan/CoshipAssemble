import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';

import Banner from '../compoents/Banner';
import AppTop from '../compoents/AppTop';
import ScrollViewPager from '../compoents/ScrollViewPager';
import ContentView from './ContentView';

export default class Movie extends PureComponent {
  render() {
    const { navigator } = this.props;
    return (
      <View style={styles.content}>
          <AppTop navigator={navigator} />
          <ScrollViewPager 
            bgColor='#fff'
            tabbarHeight={32}
            tabbarStyle={{color:'#474747',fontSize:16}}
            tabbarActiveStyle={{color:$.COLORS.mainColor}}
            tablineHidden={true}
            navigator={navigator}>
            <ContentView tablabel="精选" />
            <ContentView tablabel="电影" />
            <ContentView tablabel="直播" />
            <ContentView tablabel="综艺" />
            <ContentView tablabel="韩剧" />
            <ContentView tablabel="娱乐" />
          </ScrollViewPager>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex:1,
  },
})
