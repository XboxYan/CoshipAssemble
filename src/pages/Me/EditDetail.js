import React, { Component } from 'react';

import{
  View, 
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Text
} from 'react-native';

import RadiusButton from "../../compoents/RadiusButton";
import Appbar from '../../compoents/Appbar';
import Store from '../../util/LoginStore';
import fetchData from '../../util/Fetch';

export default class EditDetail extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            title:this.props.route.title,
            column:this.props.route.column,
            nickName:Store.userInfo.nickName,
            sign:'我是签名'
        };
    }

    submit=(navigator)=>{
        if(this.state.nickName!=''){
            fetchData('ModUserInfo',{
                par:{
                    userCode:Store.userInfo.userCode,
                    nickName:this.state.nickName
                }
            },(data)=>{
                if(data.success==='1'){
                    //设置全局变量
                    Store.userInfo.nickName = this.state.nickName
                    //存储对象
                    storage.save({
                        key: 'userInfo',
                        data: Store.userInfo,
                    });
                    //页面跳转
                    navigator.pop();
                }else{
                    alert(data.info);
                }
            })
        }else{
            alert('输入值不能为空');
        }

    }

    render(){
            const {navigator,route}=this.props;
        return (
            <View style={{flex:1,backgroundColor:'white'}}>
                <Appbar title={this.state.title+'修改'} navigator={navigator} />
                {this.state.column=='nickName'?
                <View style={styles.row}>
                    <Text style={styles.leftText}>昵称:</Text>
                    <TextInput style={styles.rightText} onChangeText={(nickName) => this.setState({nickName})} defaultValue={this.state.nickName} underlineColorAndroid='transparent' />
                </View>
                :
                <View style={styles.row}>
                    <Text style={styles.leftText}>签名:</Text>
                    <TextInput style={styles.rightText} onChangeText={(sign) => this.setState({sign})} defaultValue={this.state.sign} underlineColorAndroid='transparent' />
                </View>
                }
                <RadiusButton btnDefined={styles.btnDefined} onPress={()=>this.submit(navigator)} underlayColor='#ffffff' btnName="保存" />
            </View>
        )
    }    
}

const styles= StyleSheet.create({ 
    image:{
        width: 60, 
        height: 60,
    },
    leftText:{
        marginLeft:40,
        color:'black'
    },
    title:{
        flexDirection:'row',
        alignItems:'center',
        height:50,
        backgroundColor:'orange',
        justifyContent:'center'
    },
    rightText:{
        padding:0,
        height:50,
        // backgroundColor:'pink',
        marginRight:0,
        marginLeft:20,
        flex:1,
        textAlign:'right'
    },
    row:{
        flexDirection:'row',
        borderColor:'#F0F0F0',
        borderWidth:1/$.PixelRatio,
        paddingRight:40,
        alignItems:'center',
        height:60,
        backgroundColor:'white'
    },
    text:{
        color:"#ffffff",
        justifyContent:'center',
        textAlign:'auto'
    },
    textRow:{
        flexDirection :"row",
        height:40,
        backgroundColor:'orange'
    },
    blankRow:{
        flexDirection :"column",
        height:350,
        backgroundColor:'pink'
    },
    btnDefined:{
        backgroundColor:'#0E74FF',
        marginLeft:40,
        marginRight:40,
        height:46,
        borderRadius: 40,
        marginTop:10
    }
})