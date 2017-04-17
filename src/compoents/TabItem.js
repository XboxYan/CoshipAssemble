import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Color = '#666';
const ActiveColor = 'orangered';

const TabItem = (props)=>(
    <View style={[styles.tabitem,props.height&&{height:props.height}]}>
        <Icon size={24} name={props.icon} color={props.active?ActiveColor:Color} />
        <Text style={[styles.label,{color:props.active?ActiveColor:Color}]}>{props.label}</Text>
    </View>
)

export default TabItem;

const styles = StyleSheet.create({
  tabitem: {
    flex: 1,
    height:48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label:{
    textAlign:'center',
    fontSize:10,
    marginTop:5,
  }
});