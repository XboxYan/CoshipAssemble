import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native'
import Swiper from 'react-native-swiper';

const styles = {
  wrapper: {
      height:169,
  },

  slide: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  image: {
    flex: 1,
    backgroundColor: 'transparent'
  },

  loadingView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,.5)'
  },

  loadingImage: {
    width: 60,
    height: 60
  }
}


export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      imgList: [
        'https://gitlab.pro/yuji/demo/uploads/d6133098b53fe1a5f3c5c00cf3c2d670/DVrj5Hz.jpg_1',
        'https://gitlab.pro/yuji/demo/uploads/2d5122a2504e5cbdf01f4fcf85f2594b/Mwb8VWH.jpg',
        'https://gitlab.pro/yuji/demo/uploads/4421f77012d43a0b4e7cfbe1144aac7c/XFVzKhq.jpg',
      ],
    }
  }

  render () {
    return (
      <View style={styles.wrapper}>
        <Swiper autoplay={true} style={styles.wrapper} height={169} loop={true}>
          {
            this.state.imgList.map((item, i) => <Image
              source={{uri:item}}
              
              style={{width:$.WIDTH,height:169,resizeMode:'cover'}}
              key={i} />)
          }
        </Swiper>
      </View>
    )
  }
}