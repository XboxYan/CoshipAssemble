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
  AsyncStorage,
  Text
} from 'react-native';

import RadiusButton from "../../compoents/RadiusButton";
import EditDetail from './EditDetail';
import Qrcode from './Qrcode.js';
import Appbar from '../../compoents/Appbar';
import Touchable from '../../compoents/Touchable';

import ImagePicker from 'react-native-image-picker';

const UserInfo = '个人资料';

export default class UserInfoDetail extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            picUrl:/*userInfo.logo*/'http://10.9.216.1/live/201704/user/logo/20170413195914.jpg'
        };
    }

    //退出登录
    exit=(navigator)=>{
        // loginState = false;
        // AsyncStorage.removeItem('loginState');
        if (navigator) {
            navigator.pop();
        }
    }

    //修改编辑页面
    getEditPage=(navigator,value,column)=>{
        if (navigator) {
            // ToastAndroid.show(value,1000);
            navigator.push({
                name:EditDetail,
                title:value,
                column:column
            })
        }
    }

    //扫描二维码,绑定智能卡方法
    qrCode=(navigator)=>{
        if (navigator) {
            navigator.push({
                name:Qrcode
            })
        }
    }

    //拍照
    getPic=()=>{
        const options = {
            title:'照片选择',
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'从相册中选择',
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        }
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel) {
                // alert('User cancelled photo picker');
            }
            else if (response.error) {
                // alert('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                // alert('User tapped custom button: ', response.customButton);
            }
            else {
                let source = response.uri;
                this.setState({
                    picUrl: source
                });
                //发请求，上传照片
                // fetch('http://'+livePortalUrl+'/LivePortal/user/modUser',{
                //     method: 'post',
                //     headers: {"Content-Type": "application/x-www-form-urlencoded"},
                //     body:'version=V001&terminalType=3&type=1&'+
                //         'userId='+userInfo.userId+
                //         '&userCode='+userInfo.userCode+
                //         '&logo='+response.data+
                //         '&token='+userInfo.token
                //     })
                //     .then((response)=>response.json())
                //     .then((jsondata) =>{
                //         userInfo.logo=source;
                //     })
                //     .catch((error)=>{
                //         alert(error);
                //     });
            }
        });
    }

    render(){
        const {navigator,route} = this.props;
        return (
            <View>
                <Appbar title={UserInfo} navigator={navigator} />
                <Touchable onPress={this.getPic} style={styles.row}>
                    <Text style={styles.leftText}>头像:</Text>
                    <Image style={styles.image} source={{uri: this.state.picUrl}} />
                    <Image style={styles.arrow} source={require('../../../img/icon_arrow_right.png')} />
                </Touchable>
                <Touchable onPress={()=>this.getEditPage(navigator,"昵称","nickName",)} style={styles.row}>
                    <Text style={styles.leftText}>昵称:</Text>
                    <Text style={styles.rightText}>{/*userInfo.nickName*/}嘻嘻嘻哈</Text>
                    <Image style={styles.arrow} source={require('../../../img/icon_arrow_right.png')} />
                </Touchable>
                <Touchable onPress={()=>this.getEditPage(navigator,"签名","sign")} style={styles.row}>
                    <Text style={styles.leftText}>签名:</Text>
                    <Text style={styles.rightText}>{/*userInfo.sign*/}签名aa</Text>
                    <Image style={styles.arrow} source={require('../../../img/icon_arrow_right.png')} />
                </Touchable>
                <View style={styles.row}>
                    <Text style={styles.leftText}>手机:</Text>
                    <Text style={styles.rightText}>{/*userInfo.userCode*/}1397979879</Text>
                </View>
                <RadiusButton btnDefined={styles.btnDefined} onPress={()=>this.qrCode(navigator)} btnName="绑定智能卡" />
                <RadiusButton btnDefined={styles.btnDefined} onPress={()=>this.exit(navigator)} btnName="退出登录更换账号" />
		    </View>
        )
    }    
}

const styles= StyleSheet.create({ 
    arrow:{
        width:7,
        height:13
    },
    image:{
        width: 48, 
        height: 48,
        borderRadius:50,
        marginRight:6
    },
    orange:{
        backgroundColor:'orange',
    },
    leftText:{
        flex:1,
        marginLeft:20,
        color:'black'
    },
    rightText:{
        marginRight:6,
        textAlign:'right'
    },
    title:{
        flexDirection:'row',
        alignItems:'center',
        height:50,
        backgroundColor:'orange',
        justifyContent:'center'
    },
    row:{
        flexDirection:'row',
        borderColor:'#F0F0F0',
        borderWidth:1/$.PixelRatio,
        paddingRight:20,
        alignItems:'center',
        height:60,
        backgroundColor:'white'
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
        marginTop:8
    },
})