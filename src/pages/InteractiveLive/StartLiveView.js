import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, StatusBar, TouchableOpacity,TextInput, PixelRatio,InteractionManager,Keyboard,TouchableWithoutFeedback} from 'react-native';

import { observable, action, computed,autorun,toJS} from 'mobx';
import { observer } from 'mobx-react/native';
import ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-root-toast';

import Image from '../../compoents/Image';
import LiveSettingView from './LiveSettingView';
import PushVideo from './PushVideo';
import fetchLive, {fetchPost} from './FetchLive';
import Store from '../../util/LoginStore';

class ModUserInfo{
    @observable title = null;
    logo = null;//本地上传base64之后的
    @observable content = null;
    @observable bitrate = null;
    userId = Store.liveUserId;
    userCode = Store.liveUserCode;
    token = Store.liveToken;
    roomCode = null;
    resolution = '';
    fps = '';

    /** 以下字段仅用于数据展示和存储，不是接口字段*/
    @observable logoLocal = null;//本地图片uri
    @observable bitrateTxt = null;
    logoUri = null;
    @observable bitrateDatas = [];

    constructor(){
        const {title,logo,content,bitrate,roomCode,resolution,fps} = Store.userInfo.liveUserInfo.roomInfo;
        this.title = title;
        this.logoUri = logo;
        this.content = content;
        this.bitrate = bitrate;
        this.roomCode = roomCode;
        this.resolution = resolution;
        this.fps = fps;
        this.bitrateTxt = '';

        this._initBitrate();
    }

    _initBitrate(){
        fetchLive('getBitRate',{
            bitRateType: 2,
        },action((result)=>{
            InteractionManager.runAfterInteractions(()=>{
                if(result.dataList){
                    this.bitrateDatas = result.dataList;
                    for(let i=0;i<result.dataList.length;i++){
                        const item = result.dataList[i];
                        if(item.bitRate == this.bitrate){
                            this.bitrateTxt = item.bitRateName;
                        }
                    }
                    if(this.bitrateTxt == null && result.dataList[0]){
                        //default bitrate
                        this.chooseBitrate(result.dataList[0]);
                    }
                }
            })
        }));
    }

    @action
    chooseBitrate(bitrate){
        this.bitrateTxt = bitrate.bitRateName;
        this.bitrate = bitrate.bitRate;
        this.resolution = bitrate.resolution;
        this.fps = bitrate.fps;
    }
}

@observer
export default class StartLiveView extends PureComponent {

    modUserInfo = new ModUserInfo();

    _openSetting = ()=>{
        const {navigator} = this.props;
        navigator.push({
            name: LiveSettingView,
            modUserInfo: this.modUserInfo,
            userInfo: this.userInfo
        });
    }

    _startLiving = ()=>{
        Keyboard.dismiss();
        if(__IOS__){
            alert('你可能需要一部Android手机😜')
            return;
        }
        fetchPost('modRoom',toJS(this.modUserInfo),(data)=>{
            if(data.success){
                const {roomInfo} = Store.userInfo.liveUserInfo;
                roomInfo.title = this.modUserInfo.title;
                if(data.data){
                    roomInfo.logo = data.data;
                }
                roomInfo.content = this.modUserInfo.content;
                roomInfo.bitrate = this.modUserInfo.bitrate;
                const {navigator} = this.props;
                navigator.push({
                    name: PushVideo,
                    modUserInfo: this.modUserInfo,
                    SceneConfigs:'FloatFromBottomAndroid'
                });
            }else{
                Toast.show('开播失败，请稍后重试');
                console.warn(data.retInfo);
            }
        })
    }

    _addPoster = ()=>{
        Keyboard.dismiss();
        const options = {
            title:'更换封面',
            cancelButtonTitle:'取消',
            takePhotoButtonTitle:'拍照',
            chooseFromLibraryButtonTitle:'从相册中选择',
            quality: 1.0,
            maxWidth: 170*3,
            maxHeight: 108*3,
            storageOptions: {
                skipBackup: true
            }
        }
        ImagePicker.showImagePicker(options, (response) => {
            if (response.didCancel || response.error || response.customButton) {
                return;
            }
            this.modUserInfo.logoLocal = response.uri;
            this.modUserInfo.logo = response.data;
        });
    }

    _close = ()=>{
        Keyboard.dismiss();
        const {navigator} = this.props;
        navigator.pop();
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <Image style={styles.bg} source={require('../../../img/living_start_bg.png')}/>
                    <StatusBar barStyle='light-content' backgroundColor='transparent'/>
                    <View style={styles.content}>
                        <TopView openSetting={this._openSetting} userInfo={Store.userInfo}/>
                        <EditView addPoster={this._addPoster} modUserInfo={this.modUserInfo}/>
                        <TouchableOpacity onPress={this._startLiving}>
                            <Image style={styles.startLiving} source={require('../../../img/living_start_btn.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._close}>
                            <Image style={styles.close} source={require('../../../img/living_close.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

class TopView extends PureComponent{
    render(){
        const {logo, nickName} = this.props.userInfo;
        return(
            <View style={styles.topView}>
                <Image style={styles.headImage} source={{uri:Base + logo}} defaultSource={require('../../../img/actor_moren.png')}/>
                <View style={styles.topText}>
                    <Text style={styles.name}>{nickName}</Text>
                    <Text style={styles.readyText}>准备直播</Text>
                </View>
                <TouchableOpacity onPress={this.props.openSetting}>
                    <Image style={styles.setting} source={require('../../../img/living_setting.png')}/>
                </TouchableOpacity>
            </View>
        )
    }
}

@observer
class EditView extends PureComponent{
    render(){
        const {modUserInfo} = this.props
        const {logoUri, title, logoLocal} = modUserInfo;
        return(
            <View style={styles.center}>
                <View style={styles.edit}>
                    <TextInput
                         style={styles.editView}
                         placeholder="输入标题更吸粉哦"
                         underlineColorAndroid="transparent"
                         returnKeyType="done"
                         selectionColor="#fff"
                         placeholderTextColor="#cecece"
                         onChangeText={(text)=>modUserInfo.title = text}
                         value={title}
                       />
                    <Image style={styles.editImg} source={require('../../../img/living_edit.png')}/>
                </View>
                <TouchableOpacity activeOpacity={.8} style={styles.addView} onPress={this.props.addPoster}>
                    <Image style={styles.add} source={require('../../../img/living_add.png')}/>
                    <Text style={styles.addText}>拍摄封面</Text>
                    {
                        (logoUri||logoLocal)&&<Image style={styles.poster} source={{uri:logoLocal?logoLocal:logoUri}}/>
                    }
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bg:{
        position: 'absolute',
        resizeMode: 'stretch',
        width:$.WIDTH,
        height:$.HEIGHT,
    },
    content:{
        flex:1,
        paddingTop: $.STATUS_HEIGHT,
        paddingBottom: 56,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topView:{
        marginTop: 4,
        paddingHorizontal: 16,
        flexDirection: 'row',
        height: 54,
        alignItems: 'center',
    },
    headImage: {
        width: 56,
        height: 56,
        resizeMode: 'cover',
        borderRadius: 28
    },
    topText:{
        backgroundColor: 'rgba(0,0,0,0)',
        flex:1,
        marginLeft:14,
        justifyContent: 'space-between',
        paddingTop: 6,
    },
    name:{
        flex:1,
        fontSize: 16,
        color: '#ffa104',
    },
    readyText:{
        flex:1,
        fontSize: 13,
        color: '#ccc',
    },
    setting: {
        width: 20,
        height: 20
    },
    center:{
        width: $.WIDTH,
        backgroundColor: 'rgba(25,25,25,0.4)',
        height:188,
        alignItems: 'center',
    },
    edit:{
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        height: 40,
        paddingHorizontal: 24,
    },
    editView:{
        flex: 1,
        padding: 0,
        fontSize:12,
        color: '#DBDBDB',
    },
    editImg:{
        width: 20,
        height: 20,
    },
    addView:{
        width: 170,
        height: 108,
        marginTop: 14,
        borderWidth: 1/PixelRatio.get(),
        borderStyle: 'dashed',
        borderColor: '#999999',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    add:{
        width: 30,
        height: 30,
        marginTop: 30,
    },
    poster:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    addText:{
        fontSize:12,
        color: '#cecece',
        marginTop: 14,
    },
    startLiving:{
        width:66,
        height:66,
    },
    close:{
        width:33,
        height:33,
    }
});
