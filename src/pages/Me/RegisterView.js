import React, { Component,PureComponent} from 'react';

import {
  View, 
  StyleSheet,
  TextInput,
  AndroidTextInput,
  ListView,
  TouchableOpacity,
  Button,
  Image,
  AsyncStorage,
  Text
} from 'react-native';

import MeView from "../MeView";
import RadiusButton from "../../compoents/RadiusButton";
import Appbar from '../../compoents/Appbar';
import fetchData from '../../util/Fetch';
import Store from '../../util/LoginStore';

const footText = '注册即同意《用户协议》和《版权声明》';
const ok = '确定';
const register = '注册';
const phoneNumber = '手机号';
const checkCode = '验证码';
const getCheckCode = '获取验证码';
const passwd = '密码';

const Foot =()=><View style={styles.footStyle}><Text>{footText}</Text></View>;

class Register extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      userCode:'',
      passwd:'',
    };
  }

  //提交注册操作
  submit =(navigator)=>{
      fetchData('Register',{
            par:{
                userCode:this.state.userCode,
                passWord:this.state.passwd
            }
        },(data)=>{
            if(data.success==='1'){
                //设置全局变量
                Store.setUserInfo(data.userInfo);
                Store.setState(true);
                //存储对象
                storage.save({
                  key: 'userInfo',
                  data: data.userInfo,
                });
                //页面跳转
                navigator.pop();
                navigator.pop();
             }else{
               alert(data.info);
             }
        })  
  }

  click=()=>{
    alert('sss');
  }


  render() {
    const {navigator,route}=this.props;
    return (
		<View style={styles.wholeBackgroundColor}>
      <Appbar title={register} navigator={navigator} />
      <View style={styles.contentView}>
        <View style={styles.row}>
          <TextInput onChangeText={(userCode) => this.setState({userCode:userCode})} placeholder={phoneNumber} underlineColorAndroid='transparent' style={styles.text}/>
        </View>
        <View style={styles.row}>
          <TextInput onChangeText={(code) => this.setState({code})} placeholder={checkCode} underlineColorAndroid='transparent' style={styles.textCheckCode}/>
          <View style={styles.checkBtnView}>
            <RadiusButton onPress={()=>alert("暂无此功能-.-")} btnDefined={styles.checkBtn} btnName={getCheckCode} />
          </View>
        </View>
        <View style={styles.row}>
          <TextInput secureTextEntry={true} onChangeText={(passwd) => this.setState({passwd:passwd})} placeholder={passwd} underlineColorAndroid='transparent' style={styles.text}/>
        </View>
        <RadiusButton onPress={()=>this.submit(navigator)} btnName={ok} btnDefined={styles.btnDefined} />
      </View>
      <Foot/>
		</View>
    );
  }
}

const styles= StyleSheet.create({
  wholeBackgroundColor:{
    backgroundColor:'white',
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  }, 
  contentView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    zIndex:10
  },
  text:{
    flex:1,
    padding:0,
    paddingLeft:20,
    height:50,
  },
  textCheckCode:{
    flex:1,
    height:50,
    marginLeft:0,
    padding:0,
    paddingLeft:20,
  },
  checkBtnView:{
    flex:1,
    height:50,
    marginRight:0,
  },
  row:{
    flexDirection:'row',
    justifyContent:'center',
    height:46,
    borderRadius: 40,
    borderColor:'grey',
    marginTop:9,
    marginLeft:40,
    marginRight:40,
    borderWidth:1/$.PixelRatio,
    alignItems:'center'
  },
  btnDefined:{
    backgroundColor:'#0E74FF',
    marginLeft:40,
    marginRight:40,
    height:46,
    borderRadius: 40,
    marginTop:8
  },
  checkBtn:{
    flex:1,
    backgroundColor:'#0E74FF',
    height:50,
    borderRadius: 40,
    marginRight:0
  },
  footStyle:{
    paddingBottom:33
  }
});


module.exports = Register;