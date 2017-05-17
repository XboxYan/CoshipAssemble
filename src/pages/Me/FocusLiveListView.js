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

import Touchable from '../../compoents/Touchable';
import Loading from '../../compoents/Loading';

export default class FocusLiveListView extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            checkAll:false,
            count:0,
            userCodes:'',
            _dataSource:[],
            dataSource: [],
            isRender:false
        };
    }

    getData(){
            fetch('http://'+'10.9.216.1:8088'+'/LivePortal/user/getFocusList',{
                method: 'post',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body:'version=V001&terminalType=3&userCode='+'222222'+'&userId='+'1000201'+'&focusType=1&status=3'
            })
            .then((response)=>response.json())
            .then((jsondata) =>{
            // if(true){
            if(jsondata.ret=='0'){
                var dataArray = jsondata.dataList
                for(var i=0;i<dataArray.length;i++){
                    dataArray[i].checked=false;
                    dataArray[i].key=i;
                }
                this.setState({
                    dataSource:dataArray,
                    _dataSource:dataArray,
                    isRender:true
                });
            }
            })
            .catch((error)=>{
                alert(error);
            });
    }
    componentDidMount(){
        this.getData();
    }

    componentWillUpdate(nextProps,nextState){
        if(nextState.checkAll!=this.state.checkAll){
            let _dataSource = [...this.state._dataSource];
            var userCode = ''
            for(var i=0;i<_dataSource.length;i++){
                _dataSource[i].checked=nextState.checkAll;
                userCode = userCode + _dataSource[i].userInfo.userCode + ','
            }
            this.setState({
                dataSource:_dataSource,
                _dataSource:_dataSource,
                count:(nextState.checkAll?_dataSource.length:0),
                userCodes:(nextState.checkAll?userCode:'')
            });
        }
    }

    checkAll=()=>{
      this.setState({checkAll:!this.state.checkAll});
    }

    cancel=()=>{
        if(this.state.userCodes.length>0){
            ToastAndroid.show(this.state.userCodes,1000);
        }
    }

    check = (rowData) => {
        rowData.checked = !rowData.checked;
        var dataArray = this.state.dataSource;
        var source = '';
        var count = 0 ;
        for(var i=0;i<dataArray.length;i++){
            if(dataArray[i].checked){
                source = source + dataArray[i].userInfo.userCode+',';
                count++;    
            }
        }
        this.setState({
            count:count,
            userCodes:source
        });
    }

    renderRow(item, edit) {
        return (
        <RowData item={item} edit={edit} check={()=>this.check(item)} />
        );
    }

    render(){
        const {isRender,dataSource}=this.state;
        return (
            <View style={{flex:1}}>
                {isRender?
                <View style={styles.listView}>
                    <FlatList
                    style={styles.content}
                    data={dataSource} 
                    onEndReached={/*()=>this.loadData()*/(info)=>{
                                    console.log(info.distanceFromEnd)}}
                    onEndReachedThreshold={10}
                    renderItem={({item,edit})=>this.renderRow(item,this.props.edit)} 
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
                :
                <Loading/>
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
            <Touchable style={styles.dataRow} onPress={()=>this.check()}>
                <View style={{justifyContent:'center',marginLeft:12,marginRight:12}}>
                {edit?
                (/*this.state.checked*/item.checked?
                <Image style={styles.imageCheck} source={require('../../../img/icon_check_on.png')} />
                :
                <Image style={styles.imageCheck} source={require('../../../img/icon_check_off.png')} />
                )
                :
                null
                }
                </View>
                <View style={{width:166}}>
                    <Text style={{color:'black'}}>{item.userInfo.nickName}</Text>
                    <Text>{item.userInfo.roomInfo.columnInfo.columnName}</Text>
                </View>
                <View style={{marginRight:17}}>
                    <Image style={styles.image} source={{uri:item.userInfo.logo}}  />
                </View>
            </Touchable>
            );
    }
}

const styles= StyleSheet.create({ 
    content: {
        flex: 1,
        paddingHorizontal:5
    },
    listView:{
        flex:1
    },
    dataRow:{
        height:97,
        borderBottomWidth:1/$.PixelRatio,
        borderColor:'grey',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    imageCheck:{
        width:21,
        height:21
    },
    image:{
        width: 123, 
        height: 81
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
})