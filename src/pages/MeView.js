import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from 'react-native';

import TabItem from '../compoents/TabItem';

import Register from './RegisterView.js';
import Login from './LoginView.js';
import Focus from './FocusView.js';
import Order from './OrderView.js';
import UserInfoDetail from './UserInfoDetailView.js';
import Touchable from '../compoents/Touchable.js';

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
const loginState = false;
//图片定义
const UserPicImg = ()=><Image style={styles.image} source={false?{uri:userInfo.logo}:require('../../img/head_default_icon.png')} />;
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

const UserPic = (props)=>(
    <View style={styles.UserPic}>
        <Touchable onPress={this.setUserInfo}>
            <UserPicImg/>
        </Touchable>
    </View>
)

const LoginTrue = (props)=>(
    <View style={styles.row}>
        <Text style={styles.userNameText}>{userInfo.nickName!=null?userInfo.nickName:userInfo.userCode}</Text>
    </View>
)

const LoginFalse = (props)=>(
    <View style={{flexDirection:'column'}}>
        <View style={styles.row}>
            <Text /*onPress={()=>this.getJump(Login)}*/ style={styles.userNameText}>{loginText}</Text>
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
        <UserPic/>
        <View style={{width:'60%'}}>
        {false?
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
        <View style={{flex:1}}>
            {props.img}
        </View>
        <Text style={{flex:2,width:60,color:'#474747'}}>{props.text}</Text>
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

export default class extends React.PureComponent {

    constructor(props) {
        super(props);
        const { navigator } = props;
    }

    getJump=(value)=>{
        const {navigator} = this.props;
            if (navigator) {
                navigator.push({
                    name:value
                })
            }
    }

    setUserInfo=()=>{
        var loginState = true;
        // if(loginState){
        if(loginState){
            this.getJump(UserInfoDetail);
        }else{
            this.getJump(Login);
        }
    }

    render(){
        return (
            <View>
                <View style={styles.blankRow}>
                    <LoginInfo getJump = {this.setUserInfo}/>
                    <Contents>
                        <Content getJump = {()=>this.getJump(Login)} text={HistoryText} img={<HistoryImg/>} />
                        <Content getJump = {()=>this.getJump(Focus)} text={FollowText} img={<FollowImg/>} />
                        <Content getJump = {()=>this.getJump(Order)} text={OrderText} img={<OrderImg/>} />
                    </Contents>
                    <Contents>
                        <Content text={PutText} img={<PutImg/>} />
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
  backViewImg:{
    width:'100%',
    height:'100%'
  },
  BackViewImg:{
    height:backGroundHeight,
    width:'100%'  
  }, 
  backView:{
    width:'100%',
    height:backGroundHeight,
    backgroundColor:'black',
  },
  UserPic:{
    width:'60%',
    flex:1,
    marginTop:'0%',
    alignItems:'center', 
    flexDirection :"row",
    justifyContent:'center',
    height:110,
  },
  LoginInfo:{
    marginTop:'5%',
    height:96,
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:'white'
  },
  Contents:{
    marginTop:7,
    flexDirection:'column',
    width:'100%'
  },
  Content:{
    width:'100%',
    marginBottom:1/$.PixelRatio,
    flexDirection:'row',
    height:42,
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center',
    paddingLeft:'10%'
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
      width:23
  },
  ArrowRightImgView:{
      marginRight:20,
      marginLeft:20,
      height:13,
      width:8
  },
  ArrowRightImg:{
      height:13,
      width:8
  },
  blankRow:{
    height:'100%',
    zIndex:2
  },
  orange:{
    backgroundColor:'orange'
  }
});