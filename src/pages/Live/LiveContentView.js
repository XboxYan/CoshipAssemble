import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    Image,
    TouchableOpacity,
    FlatList,
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

import { observable, action, computed} from 'mobx';
import { observer } from 'mobx-react/native';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const TYPE_PLAYBACK = 's1';
const TYPE_LIVE = 's2';
const TYPE_FUTURE = 's3';

const TIME_FORMAT = 'YYYYMMDDHHmmss';

//定义时间
class Now {

    @observable
    now = moment();

    days = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

    @computed
    get nowArr(){
        return this.days.map(day=>({
                time:computed(()=>moment(this.now).add(day, 'days')).get(),
                date:computed(()=>moment(this.now).add(day, 'days').format('MM-DD')).get(),
                week:computed(()=>day===0?'今天':moment(this.now).add(day, 'days').format('ddd')).get()
            })
        )
    }
}

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
			this.playUrl = 'http://10.9.217.3:9093/video/mv.mp4?id='+program.programId+'&delay='+delay;
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
class ChannelItem extends PureComponent {

    @observable isSubscribe;

    @computed get type(){
        const { now, program } = this.props;
        return program.endMoment.diff(now)<0 ? TYPE_PLAYBACK : ( program.startMoment.diff(now)>0 ? TYPE_FUTURE : TYPE_LIVE);
    }

    @computed get actionText(){
        if(this.isSelect){
            return '播放中';
        }
        switch(this.type){
            case TYPE_PLAYBACK:
                return '回看';
            case TYPE_LIVE:
                return '直播中';
            case TYPE_FUTURE:
                return this.isSubscribe ? '已预约' : '预约';
        }
    }

    @computed get isSelect(){
        return playInfo.currentPlayProgram.programId == this.props.program.programId;
    }

    @action
    _play = () => {
        switch(this.type){
            case TYPE_PLAYBACK:
                playInfo.play(this.props.program);
                break;
            case TYPE_LIVE:
                playInfo.play(this.props.program, 0);
                break;
            case TYPE_FUTURE:
                this.isSubscribe = !this.isSubscribe;
                break;
        }
    }

    render(){
        const { program } = this.props;
        return (<Touchable style={[styles.channelitem, this.isSelect && {backgroundColor:'#D5D5FF'}]} onPress={this._play}>
            <Text style={styles.channelTime}>{program.startMoment.format('HH:mm')}</Text>
            <Text numberOfLines={1} style={styles.channelInfo}>{program.programName}</Text>
            <TouchableOpacity activeOpacity={.5} style={styles.channelaction}>
                <Text style={styles.channelactiontxt}>{this.actionText}</Text>
            </TouchableOpacity>
        </Touchable>)
    }
}

@observer
class ChannelList extends PureComponent {
    @observable programs = null;
    @observable canRender;

    @action
    componentDidMount(){
        const { channelId, now, time} = this.props;
        fetchData('GetPrograms',{
            par:{
                channelIds:channelId,
                startDateTime:time.time.format('YYYYMMDD[000000]')
            }
  		},(data)=>{
            const programs = data.program ? data.program.reverse() :[];
            this.programs = programs;
            for(let i=0; i<this.programs.length; i++){
                let prog =  this.programs[i]
                prog.startMoment = moment(prog.startDateTime, TIME_FORMAT);
                prog.endMoment = moment(prog.endDateTime, TIME_FORMAT);
                if(i+1 != this.programs.length){
                    prog.nextProgram = this.programs[i+1];
                }
                if(prog.startMoment.diff(now)<0 && prog.endMoment.diff(now)> 0){
                    this.timer = setTimeout(()=>{
                        playInfo.play(prog, 0);
                        this.flatList.scrollToIndex({viewPosition: 1, index:i});
                    },500)
                }
            }
            this.canRender = true;
  		})
    }

    componentWillUnmount(){
        this.timer&&clearTimeout(this.timer);
    }

    renderItem = ({item, index}) => {
        return <ChannelItem list={this.flatList} position={index} program={item} {...this.props}/>
    }
    render() {
        return (<View style={styles.content}>
            {
                this.canRender?
                <FlatList
                    ref={(flatList)=>this.flatList = flatList}
                    keyExtractor={(item, index) => item.programId}
                    data={this.programs.slice()}
                    getItemLayout={(data, index) => ({ length: 74, offset: 74 * index, index })}
                    renderItem={this.renderItem}
                />
                :<Loading />
            }
            </View>
        )
    }
}

@observer
class Time extends PureComponent {

    render(){
        const {now} = this.props;
        return <Text><Text style={{ fontSize: 14 }}>{now.week}</Text>{'\n'}<Text style={{ fontSize: 13 }}>{now.date}</Text></Text>
    }
}

@observer
class ChannelContent extends PureComponent {

    now = new Now();

    constructor(props){
        super(props);
    }

    updateNow = () => {
        requestAnimationFrame(action(() => {
            this.now.now = moment();
            this.updateNow();
        }));
    }

    componentDidMount() {
        //this.updateNow();
    }

    render() {
        const { navigator, isRender, channel} = this.props;
        return (
            <View style={styles.content}>
                <View style={styles.channelName}>
                    <Text style={styles.channelNametext}>{channel.channelName}</Text>
                </View>
                {
                    isRender ?
                        <ScrollViewPager
                            bgColor='#fff'
                            tabbarHeight={48}
                            tabbarStyle={{ color: '#474747', fontSize: 16 }}
                            tabbarActiveStyle={{ color: $.COLORS.mainColor }}
                            tablineStyle={{ backgroundColor: $.COLORS.mainColor, height: 2 }}
                            tablineHidden={false}
                            isShowMore={false}
                            pageIndex={5}
                            navigator={navigator}>
                            {
                                this.now.nowArr.map((time, index) => (
                                    <ChannelList
                                        key={`item${index}`}
                                        navigator={navigator}
                                        now={this.now.now}
                                        time={time}
                                        channelId={channel.channelId}
                                        tablabel={<Time now={time} />} />
                                ))
                            }
                        </ScrollViewPager>
                        :
                        <Loading />

                }
            </View>
        )
    }
}

@observer
export default class extends PureComponent {

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

    componentWillUpdate(nextProps, nextState) {
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
        const { channel } = route;
        const { isRender, layoutTop } = this.state;
        return (
            <View style={styles.content}>
                <StatusBar barStyle='light-content' backgroundColor='transparent' />
                <View onLayout={this.onLayout} style={styles.videoCon}></View>
                {
                    isRender && <Video
                        ref={(ref) => { this.video = ref }}
                        shiftTime={playInfo.shiftTime}
                        shiftProgress={playInfo.shiftProgress}
                        durationTV={playInfo.duration}
                        seekFilter={playInfo.seekFilter}
                        endFilter={playInfo.endFilter}
                        onProgress={playInfo.onProgress}
                        handleBack={this.handleBack}
                        playUri={playInfo.playUrl}
                        style={{ top: layoutTop }} />
                }
                <ChannelContent channel={channel} isRender={isRender} />
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
    channelitem: {
        height: 54,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    channelTime: {
        fontSize: 14,
        color: '#333',
        width: 60
    },
    channelInfo: {
        fontSize: 14,
        color: '#333',
        flex: 1
    },
    channelaction: {
        width: 60,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1 / $.PixelRatio,
        borderColor: '#ddd',
        borderRadius: 15
    },
    channelactiontxt: {
        fontSize: 14,
        color: '#333',
    }
})
