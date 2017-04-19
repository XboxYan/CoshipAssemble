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

export default class Movie extends PureComponent {
  render() {
    const { navigator } = this.props;
    return (
      <View style={styles.content}>
          <AppTop />
          <ScrollViewPager>
            <ScrollView tablabel="首页" style={{ flex: 1 }}>
                <Banner />
                <View><Text>{this.tabswidth}</Text></View>
                <View><Text>111111</Text></View>
                <View><Text>111111</Text></View>
                <View><Text>111111</Text></View>
                <View><Text>111111</Text></View>
                <View><Text>111111</Text></View>
            </ScrollView>
            <Text tablabel="推荐影视" >222222222222222222</Text>
            <Text tablabel="首页#3" >用户UI与YuiYuihi一</Text>
            <Text tablabel="首页#4" >11111111111111111</Text>
            <Text tablabel="首页#5" >分国有股股市</Text>
            <Text tablabel="首页#6" >哥和嘎嘎嘎好尴尬</Text>
            <Text tablabel="首页#7" >hjhhjkk</Text>
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
