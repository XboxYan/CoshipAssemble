import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    Image,
    Navigator,
    FlatList,
    UIManager,
    LayoutAnimation,
    InteractionManager,
    View,
} from 'react-native';

import Appbar from '../compoents/Appbar';
import Video from '../compoents/Video';
import ScrollViewPager from '../compoents/ScrollViewPager';

class ChannelList extends PureComponent {
    data=[
        {key: 'a'}, 
        {key: 'b'},
        {key: 'c'},
        {key: 'd'},
        {key: 'e'},
        {key: 'f'},
        {key: 'g'},
        {key: 'h'},
        {key: 'i'},
        {key: 'j'},
        {key: 'k'},
        {key: 'l'},
        {key: 'm'},
        {key: 'n'},
    ]
    renderItem = (item,index) => {
        const {navigator} = this.props;
        return <Text>哈哈</Text>
    }
    render(){
        return(
            <FlatList
                style={styles.content}
                data={this.data}
                getItemLayout={(data, index) => ( {length: 74, offset: 74 * index, index} )}
                renderItem={this.renderItem}
            />
        )
    }
}

class ChannelContent extends React.PureComponent {

    render() {
        const {navigator,isRender} = this.props;
        return (
            <View style={styles.content}>
                <View style={styles.channelName}>
                    <Text style={styles.channelNametext}>江苏卫视</Text>
                </View>
                <ScrollViewPager 
                    bgColor='#fff'
                    tabbarHeight={34}
                    tabbarStyle={{color:'#474747',fontSize:16}}
                    tabbarActiveStyle={{color:$.COLORS.mainColor}}
                    tablineStyle={{backgroundColor:$.COLORS.mainColor,height:2}}
                    tablineHidden={false}
                    isShowMore={false}
                    pageIndex={2}
                    navigator={navigator}>
                        <ChannelList navigator={navigator} tablabel="全部" />
                        <ChannelList navigator={navigator} tablabel="央视" />
                        <ChannelList navigator={navigator} tablabel="地方" />
                        <ChannelList navigator={navigator} tablabel="卫视" />
                        <ChannelList navigator={navigator} tablabel="体育" />
                        <ChannelList navigator={navigator} tablabel="少儿" />
                </ScrollViewPager>
            </View>
        )
    }
}

export default class extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isRender: false,
            layoutTop: 0
        }
        //处理安卓Back键
        const { navigator } = this.props;
        const routers = navigator.getCurrentRoutes();
        const top = routers[routers.length - 1];
        top.handleBack = this.handleBack;
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentWillUpdate(nextProps,nextState){
        LayoutAnimation.spring();
    }

    handleBack = () => {
        if (this.video.state.isFull) {
            this.video.setFullScreen();
        } else {
            this.video.onPause();
            this.props.navigator.pop();
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isRender: true,
                playUri: 'http://bofang.bati.cc/rr/HongMaoLanTuHuoFengHuang_hd.m3u8'
                //playUri:'http://gslb.hrtn.net:8080/live/coship,TWSX1421638319994522.m3u8?fmt=x264_0k_mpegts&sora=1&sk=C90839043C325195586FA305460BE05E&uuid=bab357c2-1be7-40cf-9883-67d9547a8f6f&userCode=hrb002&userName=hrb002&spCode=484581254562&productCode=dpacdb100&resourceCode=102400201&subId=99999999&resourceName=&authType=2'
            })
        })
    }
    onLayout = (e) => {
        let { y } = e.nativeEvent.layout;
        this.setState({
            layoutTop: y + $.STATUS_HEIGHT
        })
    }

    render() {
        const { navigator, route } = this.props;
        const { isRender, layoutTop, playUri } = this.state;
        return (
            <View style={styles.content}>
                <StatusBar barStyle='light-content' backgroundColor='transparent' />
                <View onLayout={this.onLayout} style={styles.videoCon}></View>
                {
                    isRender && <Video ref={(ref) => { this.video = ref }} handleBack={this.handleBack} playUri={playUri} style={{ top: layoutTop }} />
                }
                <ChannelContent />
            </View>

        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    videoCon: {
        height: $.WIDTH * 9 / 16 + $.STATUS_HEIGHT,
        paddingTop: $.STATUS_HEIGHT,
        backgroundColor: '#000'
    },
    channelName:{
        height:40,
        backgroundColor:'#fff',
        paddingLeft:20,
        justifyContent:'center',
        borderBottomWidth:1/$.PixelRatio,
        borderBottomColor:'#ececec'
    },
    channelNametext:{
        fontSize:16,
        color:'#333'
    }
})