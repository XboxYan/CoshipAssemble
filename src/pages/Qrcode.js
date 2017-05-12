import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import BarcodeScanner from 'react-native-barcodescanner'
import Appbar from '../compoents/Appbar';

export default class Qrcode extends Component {

  constructor(props) {
    super(props);
    this.state = {
        count:1
    };
  }

　//解析数据
  parseData(pdata){
    //保证当前页面中，这个方法只能被触发一次
    if(this.state.count==1){
      this.setState({
        count:0
      });
      var ptype = pdata.type;
      var data = pdata.data;
      alert(data);
      const {navigator} = this.props;
      if (navigator) {
          navigator.pop();
      }
    }
  }

  render() {
    let scanArea = null
    scanArea = (
        <View style={styles.rectangleContainer}>
          <View style={styles.rectangle} />
        </View>
    )
    const {navigator,route}=this.props;
    return (
        <BarcodeScanner
          onBarCodeRead={this.parseData.bind(this)}
          style={styles.camera}
        >
          <Appbar title='扫描二维码' navigator={navigator} />
          {scanArea}
        </BarcodeScanner>
    );
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1
  },
  rectangleContainer: {
    width:'100%',
    height:'100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.1)'
  },
  rectangle: {
    height: 250,
    width: 250,
    borderWidth: 2,
    borderColor: '#00FF00',
    marginBottom:67,
    backgroundColor: 'rgba(0,0,0,.1)'
  }
});