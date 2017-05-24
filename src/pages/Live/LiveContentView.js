import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    UIManager,
    LayoutAnimation,
    InteractionManager,
    View,
    Alert,
} from 'react-native';

import fetchData from '../../util/Fetch'
import Video from '../../compoents/Video';
import ScrollViewPager from '../../compoents/ScrollViewPager';
import Touchable from '../../compoents/Touchable';
import Loading from '../../compoents/Loading';
import ProgramListView from './ProgramListView'

import { observable, action, computed} from 'mobx';
import { observer } from 'mobx-react/native';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const TIME_FORMAT = 'YYYYMMDDHHmmss';

class PlayInfo{
    @observable playUrl;
    @observable currentPlayProgram={};
    @observable shiftTime;//开始时间毫秒数
    @observable endTime;//结束时间毫秒数
    @observable shiftProgress;//进度条偏移量

    @computed get duration(){
        if(this.endTime && this.shiftTime){
            return this.endTime - (this.shiftTime); // second
        }
        return 0;
    }

    @computed get isLive(){
        const {startMoment, endMoment} = this.currentPlayProgram;
        const now = moment();
        return startMoment.diff(now) < 0 && endMoment.diff(now) > 0
    }

    @action
    play(program, delay=-1){//delay 距离直播的时间，单位为秒，0为直播
        const {startDateTime, endDateTime, startMoment, endMoment} = program;
        let startTime = program.startDateTime;
        let endTime = program.endDateTime;
        const now = moment();
        if(startMoment.diff(now)>0){
            return; //预约节目
        }

        this.currentPlayProgram = program;
        this.shiftTime = moment.utc(startDateTime, TIME_FORMAT).valueOf()/1000;
        this.endTime = moment.utc(endDateTime, TIME_FORMAT).valueOf()/1000;
        this.shiftProgress = 0;
        if(delay >= 0){
            const playTime = now.add(-delay, 's')
            this.shiftProgress = playTime.diff(startMoment)/1000;
            startTime = playTime.format(TIME_FORMAT);//时移和直播
            endTime = '';
        }else if(this.isLive){
            endTime = '';//从开始时间时移
        }
        fetchData('ChannelSelectionStart',{
            par:{
                channelId: program.channelId,
                startDateTime: startTime,
                endDateTime: endTime
            }
  		},(data)=>{
            if(this.isLive){
                this.playUrl = 'http://10.9.219.22:8099/live/YSGD,YSGD2016010106675391.m3u8?fmt=x264_800k_mpegts&sk=66F5154BE4B83F4F7E2A799E7B622EC5&uuid=799997c6-1f41-498a-9cf3-34c777652b66&userCode=nancy001&userName=nancy001&spCode=484581254562&productCode=OTTZB&resourceCode=102503587&subId=99999999&resourceName=&authType=2&delay='+delay;
            }else{
                this.playUrl = 'http://10.9.217.3:9093/video/mv.mp4?delay='+delay+'&program='+program.programId;
            }
  		})
    }

    seekFilter = (value,isChange) => {
        if(isChange && this.isLive){
            const {startMoment} = this.currentPlayProgram;
            let delay = moment().diff(startMoment)/1000 - value;
            delay = delay>0? delay : 0;
            this.play(this.currentPlayProgram, delay);
            return true;
        }
        return false;
    }

    endFilter = ()=> {
        const {nextProgram} = this.currentPlayProgram;
        if(!nextProgram){
            Alert.alert('节目已全部播发完成');
            return;
        }
        this.play(nextProgram);
    }
}

const playInfo = new PlayInfo();

@observer
export default class extends PureComponent {
    @observable isRender;
    @observable layoutTop = 0;

    constructor(props) {
        super(props);
        //处理安卓Back键
        const { navigator } = this.props;
        const routers = navigator.getCurrentRoutes();
        const top = routers[routers.length - 1];
        top.handleBack = this.handleBack;
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentWillUpdate(nextProps, nextState) {
        // LayoutAnimation.spring();
    }

    handleBack = () => {
        if (this.video.isFull) {
            this.video.setFullScreen();
        } else {
            this.video.onPause();
            this.props.navigator.pop();
        }
    }

    @action
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.isRender = true;
        })
    }

    @action
    onLayout = (e) => {
        let { y } = e.nativeEvent.layout;
        this.layoutTop = y + $.STATUS_HEIGHT;
    }

    render() {
        const { navigator, route } = this.props;
        const { channel } = route;
        return (
            <View style={styles.content}>
                <StatusBar barStyle='light-content' backgroundColor='transparent' />
                <View onLayout={this.onLayout} style={styles.videoCon}></View>
                {
                    this.isRender && <Video
                        ref={(ref) => { this.video = ref }}
                        shiftTime={playInfo.shiftTime}
                        shiftProgress={playInfo.shiftProgress}
                        durationTV={playInfo.duration}
                        seekFilter={playInfo.seekFilter}
                        endFilter={playInfo.endFilter}
                        onProgress={playInfo.onProgress}
                        playUri={playInfo.playUrl}
                        handleBack={this.handleBack}
                        style={{ top: this.layoutTop }} />
                }
                <View style={styles.channelName}>
                    <Text style={styles.channelNametext}>{channel.channelName}</Text>
                </View>
                <View style={[styles.content, this.video&&this.video.isFull  && styles.fullScreen]}>
                    <ProgramListView
                        playInfo={playInfo}
                        channel={channel}
                        isRender={this.isRender}
                        navigator={navigator}
                        isFull={this.video&&this.video.isFull}
                    />
                </View>
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
    channelName: {
        height: 40,
        backgroundColor: '#fff',
        paddingLeft: 20,
        justifyContent: 'center',
        borderBottomWidth: 1 / $.PixelRatio,
        borderBottomColor: '#ececec'
    },
    channelNametext: {
        fontSize: 16,
        color: '#333'
    },
    fullScreen:{
        // position: 'absolute',
        // left: 36,
        // right: 36,
        // top:0,
        // bottom:0,
        // zIndex:100,
        // backgroundColor: 'rgba(0,0,0, .75)'
    },
})
