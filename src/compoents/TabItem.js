import React, { PureComponent,PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Icon from './Icon';

export default class TabItem extends PureComponent {

  static PropTypes = {
    Color:PropTypes.string,
    ActiveColor:PropTypes.string,
    label:PropTypes.string,
    active:PropTypes.bool,
    height:PropTypes.number
  }

  static defaultProps = {
    Color:$.COLORS.subColor,
    ActiveColor:$.COLORS.mainColor,
    label:'',
    active:false,
    height:0
  }
  render(){
    const {height,icon,iconActive,ActiveColor,Color,active,label} = this.props;
    return(
      <View style={[styles.tabitem,{height:height}]}>
          <Icon style={styles.icon} icon={icon} iconActive={iconActive} active={active} />
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
  icon:{
    width:24,
    height:24
  },
  label:{
    textAlign:'center',
    fontSize:10,
    marginTop:3,
  }
});