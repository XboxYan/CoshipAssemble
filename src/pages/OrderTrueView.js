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

export default class OrderTrueView extends React.Component{

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
                <View style={{marginLeft:5}}>
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
                <Image style={styles.image} source={require('../../img/img02.png')}  />
                <View style={{marginLeft:11,marginRight:47}}>
                    <Text style={{color:'black'}}>北京卫视</Text>
                    <Text style={{fontSize:12,marginTop:17}}>2017-04-05 12:30:00 开始</Text>
                </View>
                <View style={{marginRight:10}}>
                    <Text style={{color:'green',fontSize:12}}>直播倒计时</Text>
                    <Text style={{color:'green',fontSize:12}}> 00:05:00</Text>
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
        height:101,
        borderBottomWidth:1/$.PixelRatio,
        borderColor:'grey',
        flexDirection:'row',
        alignItems:'center'
    },
    imageCheck:{
        width:21,
        height:21
    },
    image:{
        marginLeft:18,
        width: 63, 
        height: 63,
        borderRadius: 32,
    }
})