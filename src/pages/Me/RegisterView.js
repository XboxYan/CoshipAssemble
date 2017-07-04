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
import Toast from 'react-native-root-toast';
import programOrder from '../../util/ProgramOrder';

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
      checkUser:false,
      checkPass:false
    };
  }

  //提交注册操作
  submit =(navigator)=>{
    if(this.state.checkUser&&this.state.checkPass){
      fetchData('Register',{
            par:{
                userCode:this.state.userCode,
                passWord:this.state.passwd
            }
        },(data)=>{
            if(data.success==='1'){
                //设置全局变量
                data.userInfo.passWord=this.state.passwd;
                Store.setUserInfo(data.userInfo);
                Store.setState(true);
                programOrder.refresh();
                //存储对象
                storage.save({
                  key: 'userInfo',
                  data: data.userInfo,
                });
                //页面跳转
                navigator.pop();
                navigator.pop();
             }else{
               Toast.show(data.info);
             }
        })
    }else{
        if(!this.state.checkUser&&!this.state.checkPass){
            Toast.show('请输入合法的手机号（11位数字）和密码(6~12位)');
        }else if(this.state.checkUser&&!this.state.checkPass){
            Toast.show('请输入合法密码(6~12位)');
        }else{
            Toast.show('请输入合法的手机号(11位数字)');
        }
    }
  }

  changeUser=(value)=>{
    var length = value.length;
    if(length==11&&value.indexOf(" ")<0&&!isNaN(value)){
      this.setState({
          userCode:value,
          checkUser:true
      })
    }else{
      this.setState({
          checkUser:false
      })
    }
  }

  changePass=(value)=>{
    var length = value.length;
    if(length>=6&&length<=12){
      this.setState({
          passwd:value,
          checkPass:true
      })
    }else{
      this.setState({
          checkPass:false
      })
    }
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
          <TextInput onChangeText={(userCode) => this.changeUser(userCode)} placeholder={phoneNumber} underlineColorAndroid='transparent' style={styles.text}/>
        </View>
        <View style={styles.row}>
          <TextInput secureTextEntry={true} onChangeText={(passwd) => this.changePass(passwd)} placeholder={passwd} underlineColorAndroid='transparent' style={styles.text}/>
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
    alignItems:'center'
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
