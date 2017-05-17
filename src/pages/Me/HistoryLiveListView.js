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
  SectionList,
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
            dataSource: [],
            _dataSource:[],
            isRender:false
        };
    }

    getData(){
            fetch('http://'+'10.9.216.1:8088'+'/LivePortal/user/getHistoryList',{
                method: 'post',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body:'version=V001&terminalType=3&userCode='+'222222'+'&userId='+'1000201'+'&limit=11'
            })
            .then((response)=>response.json())
            .then((jsondata) =>{
            // if(true){
            if(jsondata.ret=='0'){
                var dateArray = jsondata.dataList;
                var day = ['今天','昨天','以前'];
                var data = [];
                var dataArr1 = [];
                var dataArr2 = [];
                var dataArr3 = [];
                for(var j=0;j<dateArray.length;j++){
                    dateArray[j].key=j;
                    dateArray[j].checked=false;
                    if(j%3==0){
                        dataArr1.push(dateArray[j])
                    }
                    if(j%3==1){
                        dataArr2.push(dateArray[j])
                    }
                    if(j%3==2){
                        dataArr3.push(dateArray[j])
                    }
                }
                data.push({key: day[0], data: dataArr1});
                data.push({key: day[1], data: dataArr2});
                data.push({key: day[2], data: dataArr3});
                this.setState({
                    dataSource:data,
                    _dataSource:data,
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
            var count = 0;
            for(var i=0;i<_dataSource.length;i++){
                for(var j=0;j<_dataSource[i].data.length;j++){
                    _dataSource[i].data[j].checked=nextState.checkAll;
                    userCode = userCode + _dataSource[i].data[j].userInfo.userCode+',';
                    count++;    
                }
            }
            this.setState({
                dataSource:_dataSource,
                _dataSource:_dataSource,
                count:(nextState.checkAll?count:0),
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
            for(var j=0;j<dataArray[i].data.length;j++){
                if(dataArray[i].data[j].checked){
                    source = source + dataArray[i].data[j].userInfo.userCode+',';
                    count++;    
                }
            }
        }
        this.setState({
            count:count,
            userCodes:source
        });
    }

    _renderItem = (data) => {
        var txt = JSON.stringify(data.item);
        var bgColor = data.index % 2 == 0 ? 'red' : 'blue';
        return <Text
            style={{height:100,textAlignVertical:'center',backgroundColor:bgColor,color:'white',fontSize:10}}>{txt}</Text>
    }

    _sectionComp = (item) => {
        return <Text style={{height:30,textAlign:'center',textAlignVertical:'center',backgroundColor:'grey',color:'white',fontSize:15}}>
                {item.section.key}
               </Text>
    }

    _renderRow = (data, edit) => {
        return (
        <RowData item={data.item} edit={edit} check={()=>this.check(data.item)} />
        );
    }

    render(){
        const {isRender,dataSource}=this.state;
        var sections = [];
        var day =['今天','昨天','以前']   
        for (var i = 0; i < 3; i++) {
            var datas = [];
            for (var j = 0; j < 4; j++) {
                datas.push({title: 'title:' + j,checked:false});
            }
            sections.push({key: day[i], data: datas});
        }
        return (
            <View style={{flex:1}}>
                {isRender?
                <View style={styles.listView}>
                    <SectionList
                        renderSectionHeader={this._sectionComp}
                        renderItem={(data)=>this._renderRow(data,this.props.edit)}
                        sections={dataSource} />
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
                    <Image style={styles.image} source={{uri:item.userInfo.roomInfo.logo}}  />
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