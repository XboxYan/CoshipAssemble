/**
 * AppTop
 */

import React, { PureComponent,PropTypes } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class AppTop extends PureComponent {

  static PropTypes = {
    color:PropTypes.string,
    text:PropTypes.string,
    size:PropTypes.number,
    height:PropTypes.number
  }

  static defaultProps = {
    text:'正在加载...'
  }

  render(){
      return(
          <View style={[styles.apptop,{paddingTop:StatusBarHeight}]}>
            <Text style={styles.appname}>影视</Text>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  apptop:{
    height:50,
    justifyContent: 'center',
    backgroundColor:'orangered'
  },
  content: {
    flex:1,
    justifyContent:'center',
    alignItems: 'center',
  },
  appname:{
    fontSize:16,
    color:'#fff',
    marginLeft:20
  }

});
