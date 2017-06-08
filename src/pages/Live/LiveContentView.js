import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    UIManager,
    InteractionManager,
    View,
    Alert,
    TouchableOpacity,
    Modal,
} from 'react-native';

import fetchData from '../../util/Fetch'
import Video from '../../compoents/Video';
import ScrollViewPager from '../../compoents/ScrollViewPager';
import Touchable from '../../compoents/Touchable';
import Loading from '../../compoents/Loading';
import ProgramListView from './ProgramListView'

import { observable, action, computed,autorun} from 'mobx';
import { observer } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation';
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

    @computed get title(){
        return this.currentPlayProgram && this.currentPlayProgram.programName;
    }

    @computed get isLive(){
        const {startMoment, endMoment} = this.currentPlayProgram;
        const now = moment();
        return startMoment.diff(now) < 0 && endMoment.diff(now) > 0
    }

    isSame(program){
        return this.currentPlayProgram.programId && program && this.currentPlayProgram.programId==program.programId;
    }

    @action
    play(program, delay=-1){//delay 距离直播的时间，单位为秒，0为直播
        if(this.currentPlayProgram.programId == program.programId){
            return;//same program
        }

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
        let playType = delay == 0 ? 2 : (delay < 0 ? 3 : 4);
        if(delay >= 0){
            const playTime = now.add(-delay, 's')
            this.shiftProgress = playTime.diff(startMoment)/1000;
            startTime = playTime.format(TIME_FORMAT);//时移和直播
            endTime = '';
        }else if(this.isLive){
            endTime = '';//从开始时间时移
        }
        const par = {
            playType:playType,
            resourceCode:program.channelId,
        };
        switch (playType) {
            case 3:
                par.shiftTime = startTime;
                par.endTime = endTime;
                break;
            case 4:
                par.delay = delay;
                break;
            default:

        }
        // fetchData('getPlayURL',{
        fetchData('ChannelSelectionStart',{
            par:par
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

@observer
export default class extends PureComponent {
    @observable isRender;
    @observable layoutTop = 0;
    @observable showModal=false;
    @observable programsMap = new Map();//key:date  value:programs

    playInfo = new PlayInfo();

    constructor(props) {
        super(props);
        //处理安卓Back键
        const { navigator } = this.props;
        const routers = navigator.getCurrentRoutes();
        const top = routers[routers.length - 1];
        top.handleBack = this.handleBack;
    }

    handleBack = () => {
        if(this.video){
            if (this.video.isFull) {
                this.video.setFullScreen();
            } else {
                this.video.onPause();
                this.props.navigator.pop();
            }
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

    renderActionBar = (
        <Touchable
            onPress={()=>this.showModal = true}
            style={styles.videoTextbtn}
        >
            <Text style={styles.btntext}>节目单</Text>
        </Touchable>
    )

    render() {
        const { navigator, route } = this.props;
        const { channel } = route;
        return (
            <View style={styles.content}>
                <StatusBar barStyle='light-content' backgroundColor='transparent' />
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.showModal}
                    supportedOrientations={['portrait', 'landscape']}
                    onRequestClose={()=>this.showModal=false}
                    >
                        <View style={styles.fullScreenView}>
                            <TouchableOpacity
                                onPress={()=>this.showModal=false}
                                style={styles.slidebtn} >
                                <Icon name='clear' size={24} color={$.COLORS.subColor} />
                            </TouchableOpacity>
                            <ProgramListView
                                programsMap={this.programsMap}
                                playInfo={this.playInfo}
                                channel={channel}
                                getProgram={this.getProgram}
                                isFull={true}
                                isRender={this.isRender}
                                navigator={navigator} />
                            </View>
                        </Modal>
                <View onLayout={this.onLayout} style={styles.videoCon}></View>
                {
                    this.isRender && <Video
                        ref={(ref) => { this.video = ref }}
                        shiftTime={this.playInfo.shiftTime}
                        shiftProgress={this.playInfo.shiftProgress}
                        durationTV={this.playInfo.duration}
                        seekFilter={this.playInfo.seekFilter}
                        endFilter={this.playInfo.endFilter}
                        playUri={this.playInfo.playUrl}
                        handleBack={this.handleBack}
                        actionBar={this.renderActionBar}
                        style={{ top: this.layoutTop }}
                        title={this.playInfo.title} />
                }
                <View style={styles.channelName}>
                    <Text style={styles.channelNametext}>{channel.channelName}</Text>
                </View>
                <View style={styles.content}>
                    {
                        this.isRender && <ProgramListView
                            programsMap={this.programsMap}
                            playInfo={this.playInfo}
                            channel={channel}
                            isRender={this.isRender}
                            navigator={navigator}
                        />
                    }
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
    fullScreenView:{
        flex:1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        paddingLeft:100,
        paddingRight:100,
        paddingTop:32,
    },
    slidebtn: {
        position: 'absolute',
        width: 48,
        height: 48,
        right: 0,
        top: 0,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoTextbtn:{
        height:40,
        paddingHorizontal:10,
        justifyContent: 'center',
        overflow:'hidden'
    },
    btntext:{
        fontSize:14,
        color:'#fff'
    }
})
