import React, { PureComponent } from 'react';
import {
    StyleSheet,
    StatusBar,
    UIManager,
    InteractionManager,
    LayoutAnimation,
    Text,
    TextInput,
    ScrollView,
    FlatList,
    TouchableOpacity,
    View,
} from 'react-native';

import Loading from '../../compoents/Loading';
import Appbar from '../../compoents/Appbar';
import Image from '../../compoents/Image';
import MovieList from '../../compoents/MovieList';
import ScrollViewPager from '../../compoents/ScrollViewPager';
import FetchLive from './FetchLive';
import LiveVideo from './LiveVideo';
import LoginStore from '../../util/LoginStore';
import LoginView from '../Me/LoginView';
import Toast from 'react-native-root-toast';

class LiveInfo extends PureComponent {
    render(){
        const {nickName,userCode,logo,roomInfo:{title,roomCode,content,columnInfo:{columnName}}} = this.props.item;
        return (
            <ScrollView style={styles.content}>
                <View style={styles.channelInfo}>
                    <Image 
                        style={styles.headimg}
                        defaultSourceStyle={styles.headimg}
                        source={{uri:logo}}
                        defaultSource={require('../../../img/actor_moren.png')}
                    />
                    <View style={styles.headtext}>
                        <Text style={styles.headinfo}>{roomCode}</Text>
                        <Text style={styles.headinfo}>主播: <Text style={{color:$.COLORS.mainColor}}>{nickName||userCode}</Text></Text>
                        <Text style={styles.headinfo}>分类: <Text style={{color:$.COLORS.mainColor}}>{columnName||'未分类'}</Text></Text>
                    </View>
                </View>
                <Text style={styles.noticetitle}>直播公告</Text>
                <Text style={styles.noticetext}>{content||'暂无公告'}</Text>
            </ScrollView>
        )
    }
}

class LiveChat extends PureComponent {
    render(){
        return (
            <View style={styles.content}>
                <FlatList 
                    style={styles.content} 
                />
                <View style={styles.chatbar}>
                    <TextInput
                        style = {styles.chatinput}
                        value = {this.text}
                        maxLength = {10}
                        selectionColor = {$.COLORS.mainColor}
                        underlineColorAndroid = 'transparent'
                        onSubmitEditing = {this.onSubmit}
                        onChangeText = {this.onEdit}
                        placeholder = '请输入弹幕'
                        returnKeyLabel = '发送'
                        placeholderTextColor = '#909090'
                    />
                    <TouchableOpacity activeOpacity={.7} style={styles.chatbtn}>
                        <Text style={styles.chatbtntext}>发送</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

export default class extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isRender:false,
            isLive:false,
            isFocus:false,
            playUri:''
        }
        //处理安卓Back键
        const { navigator } = this.props;
        const routers = navigator.getCurrentRoutes();
        const top = routers[routers.length - 1];
        top.handleBack = this.handleBack;
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    handleBack = () => {
        if (this.video&&this.video.isFull) {
            this.video.setFullScreen();
        } else {
            this.video&&this.video.onPause();
            this.leaveRoom();
            this.props.navigator.pop();
        }
    }

    getPlayUrl = () => {
        const { liveUserCode, liveUserId } = LoginStore;
        const {item} = this.props.route;
        FetchLive('getPlayUrl',{
            userId: liveUserId,
			userCode: liveUserCode,
            resourceCode:item.userCode,
            roomCode:item.roomInfo.roomCode,
            playType:2
        },(data)=>{
            if(data.success){
                this.setState({
                    playUri:data.data.playURL
                })
            }
        })
    }

    enterRoom = () => {
        const { liveUserCode, liveUserId } = LoginStore;
        const {item} = this.props.route;
        FetchLive('enterRoom',{
            userId: liveUserId,
			userCode: liveUserCode,
            resourceCode:item.userCode,
            type:1,
            roomCode:item.roomInfo.roomCode,
            columnId:item.roomInfo.columnId,
            channelId:2
        },(data)=>{
            if(data.success){
                this.setState({
                    isFocus:data.data.isFocus=='1'?true:false
                })
            }
        })
    }

    leaveRoom = () => {
        const { liveUserCode, liveUserId } = LoginStore;
        const {item} = this.props.route;
        FetchLive('enterRoom',{
            userId: liveUserId,
			userCode: liveUserCode,
            type:1,
            resourceCode:item.userCode,
            roomCode:item.roomInfo.roomCode,
            columnId:item.roomInfo.columnId,
            channelId:2
        },(data)=>{
            if(data.success){
                
            }
        })
    }

    deleteFocus = () => {
        const { liveUserCode, liveUserId } = LoginStore;
        const {item} = this.props.route;
        FetchLive('deleteFocus',{
            userId: liveUserId,
			userCode: liveUserCode,
            focusUserCode:item.userCode,
            status:1
        },(data)=>{
            if(data.success){
                this.setState({isFocus:false});
                Toast.show(`取消收藏成功!`);
            }
        })
    }

    addFocus = () => {
        const { liveUserCode, liveUserId } = LoginStore;
        const {item} = this.props.route;
        FetchLive('addFocus',{
            userId: liveUserId,
			userCode: liveUserCode,
            focusUserCode:item.userCode,
            status:1
        },(data)=>{
            if(data.success){
                this.setState({isFocus:true});
                Toast.show(`收藏成功!`);
            }
        })
    }

    onFocus = () => {
        const { loginState } = LoginStore;
        const {navigator} = this.props;
        if(loginState){
            const { liveUserCode, liveUserId } = LoginStore;
            const { isFocus } = this.state;
            if(isFocus){
                this.deleteFocus();
            }else{
                this.addFocus();
            }
        }else{
            navigator.push({name:LoginView});
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const {navigator,route:{item}} = this.props;
            this.getPlayUrl();
            this.enterRoom();
            this.setState({
                isRender:true,
                isLive:item.isLive=='1'?true:false
            })
        })
    }
    componentWillUnmount() {
        
    }
    render(){
        const {navigator,route:{item}} = this.props;
        const {isRender,isLive,playUri,isFocus} = this.state;
        return (
            <View style={styles.content}>
                <StatusBar barStyle='light-content' backgroundColor='transparent' />
                <View style={styles.videoCon}></View>
                {
                    isRender&&
                    <LiveVideo 
                        onFocus = {this.onFocus}
                        isFocus={isFocus}
                        isLive={isLive}
                        title={item.roomInfo.title}
                        ref={(ref) => { this.video = ref }}
                        handleBack={this.handleBack} 
                        playUri={playUri} 
                        style={{ top: $.STATUS_HEIGHT }} />
                }
                <ScrollViewPager
                    bgColor='#fff'
                    tabbarHeight={40}
                    tabbarStyle={{ color: '#474747', fontSize: 16 }}
                    tabbarActiveStyle={{ color: $.COLORS.mainColor }}
                    tablineStyle={{ backgroundColor: $.COLORS.mainColor, height: 2 }}
                    tablineHidden={false}>
                    {
                        //<LiveChat tablabel='聊天' />
                    }
                    <LiveInfo tablabel='主播' item={item} />
                </ScrollViewPager>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor:'#fff'
    },
    videoCon: {
        height: $.WIDTH * 9 / 16 + $.STATUS_HEIGHT,
        paddingTop: $.STATUS_HEIGHT,
        backgroundColor: '#000'
    },
    chatbar:{
        flexDirection:'row',
        height:48,
        alignItems:'center',
        borderTopWidth:1/$.PixelRatio,
        borderColor:'#ececec',
    },
    chatinput: {
        fontSize:14,
        height:30,
        flex:1,
        paddingHorizontal:15,
        paddingVertical:0,
        borderRadius:15,
        backgroundColor:'#f2f2f2',
        color:'#333',
        marginHorizontal:10,
    },
    chatbtn:{
        height:30,
        paddingHorizontal:15,
        borderRadius:15,
        marginRight:10,
        backgroundColor:$.COLORS.mainColor,
        justifyContent:'center'
    },
    chatbtntext:{
        fontSize:14,
        color:'#fff'
    },
    channelInfo:{
        flexDirection:'row',
        padding:10,
        borderBottomWidth:1/$.PixelRatio,
        borderColor:'#ececec',
    },
    headimg:{
        width:60,
        height:60,
        resizeMode:'cover',
        borderRadius:30,
        marginRight:10
    },
    headtext:{    
        flex:1,
    },
    headinfo:{
        fontSize:12,
        color:'#474747',
        lineHeight:18
    },
    noticetitle:{
        fontSize:16,
        color:'#333',
        padding:10,
    },
    noticetext:{
        paddingHorizontal:10,
        fontSize:14,
        color:'#666',
        lineHeight:20
    }
})