/**
 * index
 */

import React, { PureComponent,PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  StatusBar,
  Platform,
  View,
  PixelRatio,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from './Touchable';

export default class AppBar extends PureComponent {
  static PropTypes = {
    title:PropTypes.string,
    style:PropTypes.object,
  }

  static defaultProps = {
    title:''
  }
  handle = ()=>{
      this.props.navigator.pop();
  }
  render() {
    const { onPress,title,style } = this.props;
    return (
      <View style={[styles.appbar,style]}>
        <Touchable
          style={styles.btn}
          onPress={this.handle}
          >
          <Icon name='keyboard-arrow-left' size={30} color='#fff' />
        </Touchable>
        <Text style={styles.apptitle} numberOfLines={1}>{title}</Text>
        {
          this.props.children||<View style={styles.btn}></View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appbar: {
    paddingTop:$.STATUS_HEIGHT,
    backgroundColor:'orangered',
    flexDirection: 'row',
    alignItems: 'center',
  },
  btn: {
    width: 50,
    height: 50,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  apptitle: {
    //textAlign: 'center',
    flex: 1,
    fontSize: 16,
    color: '#fff'
  }

});
