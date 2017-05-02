import React, { PureComponent,PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  FlatList,
  View,
} from 'react-native';

import Touchable from './Touchable';
import VideoContentView from '../pages/VideoContentView';

const MovieItem = (props)=>(
  <Touchable 
    onPress={()=>props.navigator.push({ name: VideoContentView})}
    style={styles.movieitem}>
    <Image style={styles.movietimg} source={require('../../img/img01.png')} />
    <View style={styles.movietext}>
      <Text numberOfLines={1} style={styles.moviename}>春娇救志明</Text>
    </View>
  </Touchable>
)

export default class extends PureComponent {
  data=[
    {key: 'a'}, 
    {key: 'b'},
    {key: 'b'},
    {key: 'b'},
    {key: 'b'},
    {key: 'b'},
  ]
  renderItem =(item,index)=>{
    return <MovieItem navigator={this.props.navigator} />
  }
  render(){

    return(
      <FlatList
        style={styles.content}
        numColumns={3}
        data={this.data}
        renderItem={this.renderItem}
      />
    )
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal:5,
  },
  movieitem:{
    width:($.WIDTH-28)/3,
    height:($.WIDTH-28)/2+40,
    marginHorizontal:3,
  },
  movietimg:{
    width:'100%',
    flex:1,
    resizeMode:'cover'
  },
  movietext:{
    alignItems: 'center',
    height:40,
    flexDirection:'row'
  },
  moviename:{
    fontSize:14,
    color:'#333',
    textAlign:'center',
    flex:1
  },
  label:{
    textAlign:'center',
    fontSize:10,
    marginTop:3,
  }
});