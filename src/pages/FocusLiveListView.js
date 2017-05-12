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
  Text
} from 'react-native';

import Touchable from '../compoents/Touchable.js';

export default class FocusLiveListView extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
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
    componentDidMount(){
        this.getData();
    }

    renderRow(rowData, sectionID, rowID, edit, checkAll) {
        var checkedRowID = null;
        return (
        <RowData rowData={rowData} edit={edit} checkAll={checkAll}/>
        /*<TouchableOpacity style={(checkedRowID==rowID?{backgroundColor:'red'}:null)} onPress={()=>{
                ToastAndroid.show('checkedRowID='+checkedRowID+'\nrowID='+rowID);
                this.checkedRowID = rowID;
                {this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(this.state.tabs)
                });}
            }}><Text>aaa</Text></TouchableOpacity>*/
        );
    }

    render(){
        return (
            <View style={styles.listView}>
                <ListView dataSource={this.state.dataSource} renderRow={(rowData, sectionID, rowID, highlightRow)=>this.renderRow(rowData, sectionID, rowID,this.props.edit,this.props.checkAll)} />
            </View>
        )
    }    
}

class RowData extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  check=()=>{
      if(this.props.edit){
        this.setState({checked:!this.state.checked});
      }
  }

   render(){
       const {rowData,edit,checkAll}=this.props;
        return (
            <Touchable style={styles.dataRow} onPress={()=>this.check()}>
                <View style={{justifyContent:'center',marginLeft:12,marginRight:12}}>
                    {edit?
                    (this.state.checked||checkAll?
                    <Image style={styles.imageCheck} source={require('../../img/icon_check_on.png')} />
                    :
                    <Image style={styles.imageCheck} source={require('../../img/icon_check_off.png')} />
                    )
                    :
                    null
                    }
                </View>
                <View style={{width:166}}>
                    <Text style={{color:'black'}}>{rowData.userInfo.nickName}</Text>
                    <Text>{rowData.userInfo.roomInfo.columnInfo.columnName}</Text>
                </View>
                <View style={{marginRight:17}}>
                    <Image style={styles.image} source={{uri:rowData.userInfo.logo}}  />
                </View>
            </Touchable>
            );
    }
}

const styles= StyleSheet.create({ 
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
    }
})