import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';

import TabItem from '../compoents/TabItem';

import Register from './Me/RegisterView';
import Login from './Me/LoginView';
import Focus from './Me/FocusView';
import History from './Me/HistoryView';
import Order from './Me/OrderView';
import UserInfoDetail from './Me/UserInfoDetailView';
import Touchable from '../compoents/Touchable';
import Store from '../util/LoginStore';

//常量定义
const backGroundHeight = 250;
const loginText = '登录';
const registerText = '注册';
const loginTextHelp = '登录后可享更多特权';
const HistoryText = '历史记录';
const FollowText = '收藏';
const OrderText = '预约节目';
const PutText = '投屏';
const BindText = '绑定';
const ApplyHostText = '申请主播';
const WeChatStoreText = '微信商城';
const HelpSuggestText = '帮助反馈';
const SetUpText = '设置';
//图片定义
const UserPicImg = ()=><Image style={styles.image} source={{uri:Store.userInfo.logo}} />
const DefaultPicImg = ()=><Image style={styles.image} source={require('../../img/head_default_icon.png')} />

                        
const OrderImg =()=><Image style={styles.littleImage} source={require("../../img/icon_order.png")} />
const HistoryImg =()=><Image style={styles.littleImage} source={require("../../img/icon_history_person.png")} />
const PutImg =()=><Image style={styles.littleImage} source={require("../../img/icon-put_on_screen.png")} />
const FollowImg =()=><Image style={styles.littleImage} source={require("../../img/icon-follow.png")} />
const BindImg =()=><Image style={styles.littleImage} source={require("../../img/icon_bind.png")} />
const ApplyHostImg =()=><Image style={styles.littleImage} source={require("../../img/icon_apply_host.png")} />
const WeChatStoreImg =()=><Image style={styles.littleImage} source={require("../../img/icon_we_chat_store.png")} />
const HelpSuggestImg =()=><Image style={styles.littleImage} source={require("../../img/icon_help_suggest.png")} />
const SetUpImg =()=><Image style={styles.littleImage} source={require("../../img/icon_set_up.png")} />
const ArrowRightImg =()=><Image style={styles.ArrowRightImg} source={require("../../img/icon_arrow_right.png")} />

const LoginTrue = (props)=>(
    <View style={{flexDirection:'column'}}>
        <View style={styles.row}>
            <Text>欢迎你:</Text>
        </View>
        <View style={{marginTop:5}}>
            <Text style={styles.userNameText}>{Store.userInfo.nickName!=null&&Store.userInfo.nickName!=''?Store.userInfo.nickName:Store.userInfo.userCode}</Text>
        </View>
    </View>
)

const LoginFalse = (props)=>(
    <View style={{flexDirection:'column'}}>
        <View style={styles.row}>
            <Text style={styles.userNameText}>{loginText}</Text>
            <Text style={styles.userNameText}>/</Text>
            <Text style={styles.userNameText}>{registerText}</Text>
        </View>
        <View style={{marginTop:5}}>
            <Text>{loginTextHelp}</Text>
        </View>
    </View>
)

const ArrowRight = ()=>(
    <View style={styles.ArrowRightImgView}>
        <ArrowRightImg/>
    </View>
)

const LoginInfo =(props)=>(
    <Touchable onPress={()=>props.getJump(Login)} style={styles.LoginInfo}>
        <View style={styles.UserPic}>
        {Store.userInfo==null?
        <Image style={styles.image} source={require('../../img/head_default_icon.png')} />
        :
        (Store.userInfo.logo!=null&&Store.userInfo.logo!=''?
            <Image style={styles.image} source={{uri:global.Base+Store.userInfo.logo}} />
            :
            <Image style={styles.image} source={require('../../img/head_default_icon.png')} />
        )
        }
        </View>
        <View style={{width:180,marginRight:60}}>
        {Store.loginState?
            <LoginTrue/>
            :
            <LoginFalse/>
        }
        </View>
        <ArrowRight/>
    </Touchable>
)

const Content =(props)=>(
    <Touchable onPress={props.getJump} style={styles.Content}>
        {props.img}
        <Text style={{marginLeft:17,flex:1,color:'#474747'}}>{props.text}</Text>
        <ArrowRight/>
    </Touchable>
)

const Contents =(props)=>(
    <View style={styles.Contents}>
        {
            props.children
        }
    </View>
)

@observer
export default class extends PureComponent {

    constructor(props) {
        super(props);
        const { navigator,route } = props;
        this.state = {
            loginState:$.loginState
        };
    }

    getJump=(value)=>{
        const {navigator} = this.props;
            if (navigator) {
                navigator.push({
                    name:value
                })
            }
    }

    setUserInfo=(value)=>{
        if(Store.loginState){
            this.getJump(UserInfoDetail);
        }else{
            this.getJump(Login);
        }
    }

    render(){
        if(Store.userInfo!=null){
            if(Store.userInfo.nickName==null){};
            if(Store.userInfo.logo==null){};
        };
        return (
            <View>
                <View style={styles.blankRow}>
                    <LoginInfo getJump = {this.setUserInfo}/>
                    <Text>{Store.loginState?'':''}</Text>
                    <Contents>
                        <Content getJump = {()=>this.getJump(History)} text={HistoryText} img={<HistoryImg/>} />
                        <Content getJump = {()=>this.getJump(Focus)} text={FollowText} img={<FollowImg/>} />
                        <Content getJump = {()=>this.getJump(Order)} text={OrderText} img={<OrderImg/>} />
                    </Contents>
                    <Contents>
                        <Content getJump = {()=>this.getJump(Login)} text={PutText} img={<PutImg/>} />
                        <Content text={BindText} img={<BindImg/>} />
                    </Contents>
                    <Contents>
                        <Content text={ApplyHostText} img={<ApplyHostImg/>} />
                        <Content text={WeChatStoreText} img={<WeChatStoreImg/>} />
                    </Contents>
                    <Contents>
                        <Content text={HelpSuggestText} img={<HelpSuggestImg/>} />
                        <Content text={SetUpText} img={<SetUpImg/>} />
                    </Contents>
                </View>
            </View>
        )
    }
}

const styles= StyleSheet.create({
  blankRow:{
      backgroundColor:'#F0F0F0'
  },
  UserPic:{
    width:57,
    flex:1,
    marginTop:0,
    // alignItems:'center', 
    // flexDirection :"row",
    justifyContent:'center',
    height:110,
    marginLeft:15
  },
  LoginInfo:{
    marginTop:22,
    height:96,
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:'white'
  },
  Contents:{
    marginTop:7,
    flexDirection:'column',
  },
  Content:{
    marginBottom:1/$.PixelRatio,
    flexDirection:'row',
    height:42,
    backgroundColor:'white',
    alignItems:'center'
  },
  row:{
    flexDirection:'row'
  },
  userNameText:{
    color:'black',
    fontSize:17
  },
  text:{
    color:"#ffffff",
    justifyContent:'center',
    textAlign:'auto'
  },
  image:{
      borderRadius:30,
      height:60,
      width:60
  },
  littleImage:{
      height:23,
      width:23,
      marginLeft:21
  },
  ArrowRightImgView:{
      marginRight:15,
      height:13,
      width:8
  },
  ArrowRightImg:{
      height:13,
      width:8
  },
  orange:{
    backgroundColor:'orange'
  }
});