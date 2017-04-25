/**
 * Loading
 */

import React, { PureComponent,PropTypes } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class Loading extends PureComponent {

  static PropTypes = {
    color:PropTypes.string,
    text:PropTypes.string,
    size:PropTypes.number,
    height:PropTypes.number
  }

  static defaultProps = {
    text:'正在加载...',
    color:$.COLORS.mainColor
  }

  render(){
      const {height,size,color,text} = this.props;
      return(
          <View style={[styles.content,height&&{height:height}]}>
            <ActivityIndicator color={color} size={size||'large'} />
            <Text style={styles.loadtext}>{text}</Text>
        </View>
      )
  }
}

const styles = StyleSheet.create({
  content: {
    flex:1,
    justifyContent:'center',
    alignItems: 'center',
  },
  loadtext:{
    fontSize:12,
    color:'#666',
    marginTop:10
  }

});
