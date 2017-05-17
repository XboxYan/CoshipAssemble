import React, { Component } from 'react';

import {
  View, 
  StyleSheet,
  TextInput,
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
import Touchable from '../../compoents/Touchable';
import Register from './RegisterView';

const loginText = '登录';
const phoneNumber = '手机号';
const checkCode = '验证码';
const passwd = '密码';

const LoginFootImg =()=><Image style={styles.ArrowRightImg} source={require("../../../img/icon_arrow_right.png")} />
const QQImage =()=><View style={styles.imageView}>
                        <Image style={styles.image} source={require("../../../img/icon_qq.png")} />
                    </View>
const WeChatImage =()=><View style={styles.imageView}>
                            <Image style={styles.image} source={require("../../../img/icon_we_chat.png")} />
                        </View>
const SinaImage =()=><View style={styles.imageView}>
                            <Image style={styles.image} source={require("../../../img/icon_sina.png")} />
                        </View>
const Bar =(props)=><Appbar title={loginText} navigator={props.navigator}>
                        <Touchable style={styles.appBar} onPress={props.getJump}>
                            <Text style={styles.appText}>注册</Text>
                        </Touchable>
                    </Appbar>
const ImageView =()=><View style={styles.imageViews}>
                        <QQImage/>
                        <WeChatImage/>
                        <SinaImage/>
                    </View>
const FootView =()=><View style={styles.foot}>
                        <Image style={styles.footImage} source={require("../../../img/icon_login_foot.png")} />
                    </View>

class Login extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            userCode:'',
            passwd:''
        }
    }

    //提交登录操作
    submit =()=>{
        if(this.state.userCode!=''&&this.state.passwd!=''){
            fetch('http://'+livePortalUrl+'/LivePortal/user/login',{
                method: 'post',
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body:'version=V001&terminalType=3&type=1&userCode='+this.state.userCode+'&passwd='+this.state.passwd+'&code='+this.state.code
            })
            .then((response)=>response.json())
            .then((jsondata) =>{
            // if(true){
            if(jsondata.ret=='0'){
                //设置全局变量
                loginState = true;
                userInfo = jsondata.data;
                AsyncStorage.setItem('userInfo',JSON.stringify(userInfo),
                        function(errs){
                            if(errs){
                                alert('save success!');
                            }else{
                                alert(errs);
                            }
                        })
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

    getJump=(value,navigator)=>{
        if (navigator) {
            navigator.push({
                name:value
            })
        }
    }

render() {
    const {navigator,route}=this.props;
    return (
		<View style={styles.wholeBackgroundColor}>
            <Bar navigator={navigator} getJump={()=>this.getJump(Register,navigator)}/>
            <View style={styles.contentView}>
                <View style={styles.row}>
                    <TextInput onChangeText={(userCode) => this.setState({userCode})} placeholder={phoneNumber} underlineColorAndroid='transparent' style={styles.text}/>
                </View>
                <View style={styles.row}>
                    <TextInput onChangeText={(passwd) => this.setState({passwd})} placeholder={passwd} underlineColorAndroid='transparent' style={styles.text}/>
                </View>
                <RadiusButton onPress={this.submit} btnName={loginText} btnDefined={styles.btnDefined} />
                <ImageView/>
            </View>
            <FootView/>
        </View>
    );
  }
}

const styles= StyleSheet.create({ 
  wholeBackgroundColor:{
    backgroundColor:'white',
    flex:1
  }, 
  contentView:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    zIndex:10
  },
  appBar:{
      marginRight:20,
      marginTop:14,
      marginBottom:14
  },
  appText:{
    textAlign: 'center',
    flex: 1,
    fontSize: 16,
    color: '#474747'
  },
  imageViews:{
    flexDirection:'row',
    height:46,
    marginRight:53,
    marginLeft:53,
    marginTop:35
  },
  imageView:{
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  image:{
    width:50,
    height:50
  },
  foot:{
    position:'absolute',
    bottom:0
  },
  footImage:{
    width:360,
    height:133
  },
  text:{
    flex:1,
    padding:0,
    paddingLeft:20,
    height:50,
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
    backgroundColor:'blue',
    height:50,
    borderRadius: 40,
    marginRight:0
  }
});


module.exports = Login;