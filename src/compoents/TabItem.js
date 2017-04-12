import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
const styles = StyleSheet.create({
  tabitem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label:{
      textAlign:'center',
      fontSize:10,
      marginTop:5
  }
});
const TabItem = (props)=>(
    <View style={styles.tabitem}>
        <View style={{width:24,height:24,backgroundColor:props.tintColor}}></View>
        <Text style={[styles.label,{color:props.tintColor}]}>{props.label}</Text>
    </View>
)

export default TabItem;