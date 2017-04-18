import React, { PureComponent,PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default class TabItem extends PureComponent {

  static PropTypes = {
    Color:PropTypes.string,
    ActiveColor:PropTypes.string,
    label:PropTypes.string,
    icon:PropTypes.string,
    active:PropTypes.bool,
    height:PropTypes.number
  }

  static defaultProps = {
    Color:'#666',
    ActiveColor:'orangered',
    label:'',
    icon:'',
    active:false,
    height:0
  }
  render(){
    const {height,icon,ActiveColor,Color,active,label} = this.props;
    return(
      <View style={[styles.tabitem,{height:height}]}>
          <Icon size={24} name={icon} color={active?ActiveColor:Color} />
          <Text style={[styles.label,{color:active?ActiveColor:Color}]}>{label}</Text>
      </View>
    )
  }
}

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
    marginTop:3,
  }
});