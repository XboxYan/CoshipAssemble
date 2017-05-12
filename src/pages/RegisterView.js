import React, { Component,PureComponent} from 'react';

import {
  View, 
  StyleSheet,
  TextInput,
  ListView,
  TouchableOpacity,
  Button,
  Image,
  Text
} from 'react-native';

import MeView from "./MeView";
import RadiusButton from "../compoents/RadiusButton";
import Appbar from '../compoents/Appbar';

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
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 == r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        'John', 'Joel', 'Joel', 'James', 'Jimmy'
      ])
    };
  }

  //提交注册操作
  submit =()=>{
    fetch('http://'+livePortalUrl+'/LivePortal/user/quickRegisterUser',{
      method: 'post',
      headers: {"Content-Type": "application/x-www-form-urlencoded"},
      body:'version=V001&terminalType=3&type=1&userCode='+this.state.userCode+'&passwd='+this.state.passwd+'&code='+this.state.code
    })
    .then((response)=>response.json())
    .then((jsondata) =>{
        // if(true){
        if(jsondata.ret=='0'){
          loginState = true;
          userInfo = jsondata.data;
          const {navigator} = this.props;
          if (navigator) {
                  navigator.push({
                    component:MeView
              })
          }
        }else{
          alert(jsondata.retInfo);
        }
    })
    .catch((error)=>{
      alert(error);
    });
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
          <TextInput onChangeText={(userCode) => this.setState({userCode})} placeholder={phoneNumber} underlineColorAndroid='transparent' style={styles.text}/>
        </View>
        <View style={styles.row}>
          <TextInput onChangeText={(code) => this.setState({code})} placeholder={checkCode} underlineColorAndroid='transparent' style={styles.textCheckCode}/>
          <View style={styles.checkBtnView}>
            <RadiusButton onPress={()=>alert('check')} btnDefined={styles.checkBtn} btnName={getCheckCode} />
          </View>
        </View>
        <View style={styles.row}>
          <TextInput onChangeText={(passwd) => this.setState({passwd})} placeholder={passwd} underlineColorAndroid='transparent' style={styles.text}/>
        </View>
        <RadiusButton onPress={this.submit} btnName={ok} btnDefined={styles.btnDefined} />
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