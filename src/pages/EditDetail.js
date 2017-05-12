import React, { Component } from 'react';

import{
  View, 
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Text
} from 'react-native';

import RadiusButton from "../compoents/RadiusButton";
import Appbar from '../compoents/Appbar';

export default class EditDetail extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            title:this.props.route.title,
            column:this.props.route.column,
            nickName:/*userInfo.nickName*/'呵呵哒',
            sign:/*userInfo.sign*/'DJ怪'
        };
        // alert(JSON.stringify(this.state.data));
    }

    submit=()=>{
        if(this.state.nickName!=''){
            fetch('http://'+livePortalUrl+'/LivePortal/user/modUser',{
                method: 'post',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body:'version=V001&terminalType=3&type=1&'+
                     'userCode='+userInfo.userCode+
                     '&userId='+userInfo.userId+
                     '&nickName='+this.state.nickName+
                     '&sign='+this.state.sign+
                     '&token='+userInfo.token
            })
            .then((response)=>response.json())
            .then((jsondata) =>{
            // if(true){
            if(jsondata.ret=='0'){
                loginState = true;
                if(this.state.nickName!=''){
                    userInfo.nickName = this.state.nickName;
                }
                if(this.state.sign!=''){
                    userInfo.sign  = this.state.sign;
                }
                const {navigator} = this.props;
                if (navigator) {
                    navigator.pop();
                }
            }else{
                alert(jsondata.retInfo);
            }
            })
            .catch((error)=>{
                alert(error);
            });
        }else{
            alert('账号/密码不能为空');
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
                    <Text style={styles.leftText}>昵称:</Text>
                    <TextInput style={styles.rightText} onChangeText={(sign) => this.setState({sign})} defaultValue={this.state.sign} underlineColorAndroid='transparent' />
                </View>
                }
                <RadiusButton btnDefined={styles.btnDefined} onPress={()=>/*this.submit()*/alert('aaa')} underlayColor='#ffffff' btnName="保存" />
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