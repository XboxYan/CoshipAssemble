import React, { Component } from 'react';

import{
  View, 
  StyleSheet,
  TextInput,
  ListView,
  TouchableOpacity,
  Button,
  Image,
  TouchableHighlight,
  Picker,
  ToastAndroid,
  FlatList,
  Text
} from 'react-native';

import Touchable from '../compoents/Touchable.js';

const MovieItem = (props)=>(
  <Touchable style={styles.movieitem}>
    <Image style={styles.movietimg} source={require('../../img/img01.png')} />
    <View style={styles.movietext}>
      <Text numberOfLines={1} style={styles.moviename}>春娇救志明</Text>
    </View>
  </Touchable>
)

export default class FocusMovieListView extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            edit:this.props.edit,
            checkAll:props.checkAll,
        };
    }

    getData(){
        fetch('http://'+'10.9.216.1:8088'+'/LivePortal/user/getFocusList',{
            method: 'post',
            headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body:'version=V001&terminalType=3&userCode='+'222222'+'&userId='+'1000201'+'&focusType=1&status=3&limit=8'
        })
        .then((response)=>response.json())
        .then((jsondata) =>{
        // if(true){
        if(jsondata.ret=='0'){
            // ToastAndroid.show(JSON.stringify(jsondata),1000);
            this.setState({
                dataSource:this.state.dataSource.cloneWithRows(jsondata.dataList),
                tabs:jsondata.dataList
            });
        }
        })
        .catch((error)=>{
            alert(error);
        });
    }
    // componentDidMount(){
        // this.getData();
    // }

    data=[
    {key: 'a'}, 
    {key: 'b'},
    {key: 'c'},
    {key: 'd'},
    {key: 'e'},
    {key: 'f'},
    {key: 'g'},
    {key: 'h'},
    {key: 'i'},
    {key: 'k'},
    {key: 'j'}
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