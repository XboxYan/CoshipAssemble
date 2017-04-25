import React, { PureComponent,PropTypes } from 'react';
import {
  StyleSheet,
  Text,
  Image,
  FlatList,
  View,
} from 'react-native';

import Touchable from './Touchable';

const MovieItem = (props)=>(
  <View style={styles.movieitem}>
    <Touchable style={styles.movietouch}>
      <Image style={styles.movietimg} source={require('../../img/img01.png')} />
      <View style={styles.movietext}>
        <Text style={styles.moviename}>春娇救志明</Text>
      </View>
    </Touchable>
  </View>
)

export default class MovieList extends PureComponent {
  data=[
    {key: 'a'}, 
    {key: 'b'},
    {key: 'b'},
    {key: 'b'},
    {key: 'b'},
  ]
  renderItem(item,index){
    return <MovieItem />
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
    paddingHorizontal:8,
  },
  movieitem:{
    width:($.WIDTH-16)/3,
    justifyContent: 'center',
    flexDirection:'row'
  },
  movietouch:{

  },
  movietimg:{
    width:112,
    height:168
  },
  movietext:{
    alignItems: 'center',
    height:40,
    flexDirection:'row'
  },
  moviename:{
    fontSize:14,
    color:'#333',
    flex:1
  },
  label:{
    textAlign:'center',
    fontSize:10,
    marginTop:3,
  }
});