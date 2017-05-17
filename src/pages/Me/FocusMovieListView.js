import React, { PropTypes,Component } from 'react';

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

import Touchable from '../../compoents/Touchable.js';
import Loading from '../../compoents/Loading';
import Focus from './FocusView.js';

import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';


export default class FocusMovieListView extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            checkAll:false,
            count:0,
            assetIds:'',
            isRender:false,
            currentPage:1,
            pageSize:9,
	        	_dataSource:[],
            dataSource: [],
        };
    }

    getData(){
      var body = `<GetBookmarks 
                  startAt="1" 
                  maxItems="`+(this.state.currentPage*this.state.pageSize)+`" 
                  portalId="1" 
                  client="8512010487528609" 
                  account="DEFA02243572"/>`

      fetch(`http://10.9.219.24:8080/GetBookmarks?dataType=JSON`, {
        method: 'POST',
        headers: {'Content-Type': 'text/xml'},
        body: body
      })
      .then((response) => {
        if (response.ok) {
          return response.json()
      }
      })
      .then((data) => {
        if(data.totalResults>0){
          var dataArray = [];
          dataArray = data.bookmarkedItem;
          for(var i=0;i<dataArray.length;i++){
            dataArray[i].key = i;
            dataArray[i].checked = false;
          }
          this.setState({
            dataSource:dataArray,
            _dataSource:dataArray,
            isRender:true
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
    }

	componentDidMount() {
    this.getData();
	}

  loadData=()=>{
        this.setState({
            currentPage:this.state.currentPage+1
        })
        this.getData();
    }

    
  checkAll=()=>{
      this.setState({checkAll:!this.state.checkAll});
  }

  cancel=()=>{
    if(this.state.assetIds.length>0){
      ToastAndroid.show(this.state.assetIds,1000);
    }
  }

  
  componentWillUpdate(nextProps,nextState){
        if(nextState.checkAll!=this.state.checkAll){
            let _dataSource = [...this.state._dataSource];
            var ids = '';
            for(var i=0;i<_dataSource.length;i++){
                _dataSource[i].checked=nextState.checkAll;
                ids = ids + _dataSource[i].selectableItem[0].assetId+','
            }
            this.setState({
                dataSource:_dataSource,
                _dataSource:_dataSource,
                count:(nextState.checkAll?_dataSource.length:0),
                assetIds:(nextState.checkAll?ids:'')
            });
        }
    }

  check = (rowData) => {
    rowData.checked = !rowData.checked;
    var dataArray = this.state.dataSource;
    var source = '';
    var count = 0;
    var ids = '';
    for(var i=0;i<dataArray.length;i++){
        if(dataArray[i].checked){
            ids = ids + dataArray[i].selectableItem[0].assetId+','
            count++;
        }
    }
    this.setState({
      count:count,
      assetIds:ids
    });
  }

  renderItem(item,edit){
    return <RowData item={item} edit={edit} check={()=>this.check(item)} />
  }
  render(){
    const { navigator } = this.props;
		const { dataSource,isRender } = this.state;
    return(
      <View style={{flex:1}}>
      {
      isRender?
      <View style={{flex:1}}>
        <FlatList
        style={styles.content}
        numColumns={3}
        data={dataSource}
        onEndReached={/*()=>this.loadData()*/(info)=>{
                        console.log(info.distanceFromEnd)}}
        onEndReachedThreshold={10}
        renderItem={({item,edit})=>this.renderItem(item,this.props.edit)}
      />
      {this.props.edit?
        <View style={styles.edit}>
            <Text onPress={this.checkAll} style={{textAlign:'center',flex:10,color:'black',height:46,paddingTop:11}}>{!this.state.checkAll?'全选':'取消'}</Text>
            <Text style={{textAlign:'center',flex:1,color:'#ECECEC'}}>|</Text>
            <Text onPress={this.cancel} style={{textAlign:'center',flex:10,color:'black',height:46,paddingTop:11}}>取消关注({this.state.count})</Text>
        </View>
      :null
      }
      </View>
      :<Loading/>
      }
      </View>
    )
  }
}

class RowData extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
        all:false
    };
  }

  check=()=>{
      if(this.props.edit){
        this.setState({checked:!this.state.checked});
        this.props.check(this.props.item);
      }
  }

   render(){
       const {item,edit}=this.props;
        return (
            <Touchable style={styles.movieitem} onPress={()=>this.check()}>
              <Image style={styles.movietimg} source={require('../../../img/img01.png')} />
              <View style={styles.movietext}>
                {edit?
                (/*this.state.checked*/item.checked?
                <Image style={styles.imageCheck} source={require('../../../img/icon_check_on.png')} />
                :
                <Image style={styles.imageCheck} source={require('../../../img/icon_check_off.png')} />
                )
                :
                null
                }
                <Text numberOfLines={1} style={styles.moviename}>{item.selectableItem[0].titleFull}</Text>
              </View>
            </Touchable>
            );
    }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal:5
  },
  movieitem:{
    width:($.WIDTH-28)/3,
    height:($.WIDTH-28)/2+40,
    marginHorizontal:3
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
  imageCheck:{
    width:21,
    height:21
  },
  edit:{
        height:46,
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#ECECEC',
        borderWidth:1/$.PixelRatio,
    }
});