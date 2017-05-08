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
    
  },
  img: {
    flex:1,
    height:$.WIDTH*9/16,
    width:$.WIDTH,
    resizeMode:'cover'
  },
  imgwrap:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadView: {
    flex:1,
    backgroundColor: '#f1f1f1'
  }
}


export default class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      imgList: [],
      isRender:false
    }
  }

  componentDidMount() {
      this.setState({
          imgList:[
            'http://10.9.216.1:8080/poster_root/20140304/GZGD8131393902995789/288x383/20140304111647549_1313.jpg',
            'http://10.9.216.1:8080/poster_root/20140304/GZGD8131393902995789/288x383/20140304111647549_1313.jpg',
            'http://10.9.216.1:8080/poster_root/20140304/GZGD8131393902995789/288x383/20140304111647549_1313.jpg',
          ],
          isRender:true
      })
  }

  render () {
    const {isRender,imgList} = this.state;
    return (
      <View style={styles.wrapper}>
        {
           isRender?
           <Swiper autoplay={true} height={$.WIDTH*9/16} loop={true}>
              {
                imgList.map((item, i) => <View key={i}  style={styles.imgwrap}><Image
                  source={{uri:item}}
                  style={styles.img}
                  /></View>)
              }
            </Swiper>
            :
            <View style={styles.loadView}></View>
        } 
      </View>
    )
  }
}