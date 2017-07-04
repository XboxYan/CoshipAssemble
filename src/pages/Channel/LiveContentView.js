import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    UIManager,
    InteractionManager,
    View,
    TouchableOpacity,
    Modal,
    Share,
    Alert,
} from 'react-native';

import fetchData from '../../util/Fetch'
import Video from '../../compoents/Video';
import ScrollViewPager from '../../compoents/ScrollViewPager';
import Touchable from '../../compoents/Touchable';
import Loading from '../../compoents/Loading';
import ProgramListView from './ProgramListView'
import LoginView from '../Me/LoginView';
import Store from '../../util/LoginStore';

import { observable, action, computed,autorun} from 'mobx';
import { observer } from 'mobx-react/native';
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const TIME_FORMAT = 'YYYYMMDDHHmmss';

class PlayInfo{
    @observable playUrl ;
    @observable currentPlayProgram={};
    @observable shiftTime;//开始时间毫秒数
    @observable endTime;//结束时间毫秒数
    @observable shiftProgress;//进度条偏移量
    @observable delay;

    playType = 2;

    constructor(now){
        this.updateTime=now;
    }

    @computed get duration(){
        if(this.endTime && this.shiftTime){
            return this.endTime - (this.shiftTime); // second
        }
        return 0;
    }

    @computed get title(){
        return this.currentPlayProgram && this.currentPlayProgram.programName;
    }

    @computed get isLiveProgram(){
        const {startMoment, endMoment} = this.currentPlayProgram;
        const now = moment();
        return startMoment.diff(now) <= 0 && endMoment.diff(now) > 0
    }

    //当前是否为直播?
    @computed get isLive(){
        return this.playType==2;
    }

    //当前是否为回看?
    @computed get isPlayBack(){
        return this.playType==3;
    }

    //当前是否为时移？
    @computed get isTimeShift(){
        return this.playType==4;
    }

    isSame(program){
        return this.currentPlayProgram.programId && program && this.currentPlayProgram.programId==program.programId;
    }

    @action
    play(program, delay=-1){//delay 距离直播的时间，单位为秒，0为直播
        this.updateTime.update();
        if(this.isSame(program) && delay < 0){
            return;//same program
        }

        const {startDateTime, endDateTime, startMoment, endMoment} = program;
        const now = moment();
        if(startMoment.diff(now)>0){
            return; //预约节目
        }

        this.currentPlayProgram = program;
        this.shiftTime = moment.utc(startDateTime, TIME_FORMAT).valueOf()/1000;
        this.endTime = moment.utc(endDateTime, TIME_FORMAT).valueOf()/1000;
        this.shiftProgress = 0;
        this.playType =  this.isLiveProgram ? (delay > 0 ? 4 : 2) : 3;
        if(this.playType == 2 || this.playType == 4){
            const playTime = now.add(-delay, 's')
            this.shiftProgress = playTime.diff(startMoment)/1000;
        }
        const par = {
            playType:this.playType,
            resourceCode:program.channelId,
            fmt: '2',
        };
        switch (this.playType) {
            case 3:
                par.shifttime = startMoment.valueOf()/1000;
                par.shiftend = endMoment.valueOf()/1000;
                break;
            case 4:
                par.delay = parseInt(delay);
                break;
            default:
        }
        fetchData('getPlayURL',{
            par:par
  		},(data)=>{
            this.playUrl = data.palyURL;
  		})
    }

    seekFilter = (value,isChange) => {
        if(isChange && this.isLiveProgram){
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
            Toast.show('节目已全部播放完成');
            return;
        }

        if(this.isLive){
            this.play(nextProgram,0);
        }else if(this.isTimeShift){
            let delay=-1;
            if(moment()-nextProgram.endMoment<0){
                delay=(moment()-nextProgram.startMoment)/1000;
            }
            this.play(nextProgram,delay)
        }else if(this.isPlayBack){
            let delay=-1;
            if(moment()-nextProgram.endMoment<0){
                delay=(moment()-nextProgram.startMoment)/1000;
            }
            this.play(nextProgram,delay)
        }
        //this.play(nextProgram);
    }
}

//定义时间
class Now {
    @observable
    now = moment();

    days = [-6, -5, -4, -3, -2, -1, 0, 1, 2];

    @computed
    get nowArr(){
        return this.days.map(day=>({
                time:computed(()=>moment(this.now).add(day, 'days')).get(),
                date:computed(()=>moment(this.now).add(day, 'days').format('MM-DD')).get(),
                week:computed(()=>day===0?'今天':moment(this.now).add(day, 'days').format('ddd')).get()
            })
        )
    }

    update(){
        this.now = moment();
    }
}

@observer
export default class extends PureComponent {
    @observable isRender;
    @observable layoutTop = 0;
    @observable showModal=false;
    @observable programsMap = new Map();//key:date  value:programs

    now = new Now();
    playInfo = new PlayInfo(this.now);

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

        this.timer&&clearInterval(this.timer);
        this.timer=setInterval(()=>{
            this.now.update();
        }, 60*1000)
    }

    componentWillUnmount(){
        this.timer&&clearInterval(this.timer);
    }

    @action
    onLayout = (e) => {
        let { y } = e.nativeEvent.layout;
        this.layoutTop = y + $.STATUS_HEIGHT;
    }

    share = ()=>{
        const { channel } = this.props.route;
        const name = this.playInfo.title ? this.playInfo.title : channel.channelName
        Share.share({
            title:'全业务App',
            message:'我正在使用全业务App看电视 - ' + name + ' ,快来一起看吧'
        }).then((result)=>{
            if (result.action === Share.sharedAction) {
                Toast.show('分享成功')
            // } else if (result.action === Share.dismissedAction) {}
            }
        })
    }

    _loginCheck = ()=>{
        if(Store.needLogin){
            Alert.alert('提示', '您还未登录，是否立即登录', [{
                text : '取消'
            },{
                text : '立即登录',
                onPress : () => {
                    if(this.video){
                        if (this.video.isFull) {
                            this.video.setFullScreen();
                        }
                        this.video.onPause();
                    }
                    this.showModal = false;
                    this.props.navigator.push({name: LoginView});
                }
            }]);
        }
        return Store.needLogin;
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
        const { channel, playProgram } = route;
        const {channelName, channelId} = channel;
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
                            channel={{channelName,channelId}}
                            getProgram={this.getProgram}
                            isFull={true}
                            now={this.now}
                            loginCheck={this._loginCheck}
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
                        share={this.share}
                        style={{ top: this.layoutTop }}
                        title={this.playInfo.title} />
                }
                <View style={styles.channelName}>
                    <Text style={styles.channelNametext}>{channelName}</Text>
                </View>
                <View style={styles.content}>
                    {
                        this.isRender && <ProgramListView
                            programsMap={this.programsMap}
                            playInfo={this.playInfo}
                            channel={{channelName,channelId}}
                            isRender={this.isRender}
                            navigator={navigator}
                            now={this.now}
                            loginCheck={this._loginCheck}
                            playProgram={playProgram}
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
