import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
} from 'react-native';

import ScrollViewPager from '../compoents/ScrollViewPager';

export default class Movie extends PureComponent {
  state = {
    pageIndex:0
  }
  onPageSelected=(index)=>{
    //alert(index)
    //this.refs.viewpager.setPage(index);
  }
  componentDidMount(){
    //this.viewpager.setPage(2)
  }
  render() {
    return (
      <ScrollViewPager />
    );
  }
}
