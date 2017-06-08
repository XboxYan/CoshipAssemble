import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    FlatList,
    View,
    InteractionManager,
} from 'react-native';

import fetchData from '../../util/Fetch'
import ScrollViewPager from '../../compoents/ScrollViewPager';
import Touchable from '../../compoents/Touchable';
import Loading from '../../compoents/Loading';
import programOrder from '../../util/ProgramOrder';

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

@observer
class ChannelItem extends PureComponent {

    @computed get isSubscribe(){
        return programOrder.hasOrdered(this.props.program.programId)
    }

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
        const {playInfo, program} = this.props;
        return playInfo.isSame(program);
    }

    @action
    _play = () => {
        const {program, playInfo} = this.props;
        switch(this.type){
            case TYPE_PLAYBACK:
                playInfo.play(program);
                break;
            case TYPE_LIVE:
                playInfo.play(program, 0);
                break;
            case TYPE_FUTURE:
                programOrder.trigger(program);
                break;
        }
    }

    render(){
        const { program, isFull } = this.props;
        // const styleSelect = this.isSelect && styles.select;
        // const styleFull = isFull && styles.fullscreenItem;
        const style = this.isSelect && styles.select || isFull && styles.fullscreenItem;
        return (<Touchable style={[styles.channelitem, isFull&&{backgroundColor:'rgba(0,0,0,0)'}]} onPress={this._play}>
            <Text style={[styles.channelTime, style]}>{program.startMoment.format('HH:mm')}</Text>
            <Text numberOfLines={1} style={[styles.channelInfo, style]}>{program.programName}</Text>
            <TouchableOpacity activeOpacity={.5} style={[styles.channelaction, this.isSelect && {borderWidth:0}]}>
                <Text style={[styles.channelactiontxt, style]}>{this.actionText}</Text>
            </TouchableOpacity>
        </Touchable>)
    }
}

@observer
class ChannelList extends PureComponent {
    @observable canRender;

    @computed get programs(){
        const { programsMap, time} = this.props;
        return programsMap.get(time.date);
    }

    @action
    componentDidMount(){
        const { programsMap, channelId, time} = this.props;
        if(this.programs){
            this._showPrograms();
            return;
        }
        fetchData('GetPrograms',{
            par:{
                channelIds:channelId,
                startDateTime:time.time.format('YYYYMMDD[000000]')
            }
  		},(data)=>{
            const programs = data.program ? data.program.reverse() : [];
            programsMap.set(time.date, programs);
            this._showPrograms(programs)
  		})
    }

    _showPrograms(){
        for(let i=0; i<this.programs.length; i++){
            let prog =  this.programs[i]
            prog.startMoment = moment(prog.startDateTime, TIME_FORMAT);
            prog.endMoment = moment(prog.endDateTime, TIME_FORMAT);
            if(i+1 != this.programs.length){
                prog.nextProgram = this.programs[i+1];
            }
            this._playLiveIfNone(prog, i);
        }
        this.canRender = true;
    }

    //当前没有播放节目时，播放直播节目
    _playLiveIfNone(prog, i){
        const { now, playInfo} = this.props;
        if(playInfo.isSame(prog)){
            this.timer = setTimeout(()=>{
                this.flatList.scrollToIndex({viewPosition: 0.5, index:i});
            },500);
        }
        if(playInfo.currentPlayProgram.programId){
            return;
        }
        if(prog.startMoment.diff(now)<0 && prog.endMoment.diff(now)> 0){
            this.timer = setTimeout(()=>{
                playInfo.play(prog, 0);
                this.flatList.scrollToIndex({viewPosition: 0.5, index:i});
            },500)
        }
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
                    getItemLayout={(data, index) => ({ length: this.programs.length, offset: 54 * index, index })}
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
export default class ProgramListView extends PureComponent {
    now = new Now();

    updateNow = () => {
        requestAnimationFrame(action(() => {
            this.now.now = moment();
            this.updateNow();
        }));
    }

    componentDidMount() {
        // this.updateNow();
    }

    render() {
        const { navigator, isRender, channel, isFull} = this.props;
        return (
            <View style={[styles.content, isFull && styles.fullscreenPrograms]}>
                {
                    isRender ?
                        <ScrollViewPager
                            bgColor= {isFull ? 'rgba(0,0,0,0)' : '#fff'}
                            tabbarHeight={48}
                            tabbarStyle={[{ color: '#474747', fontSize: 16 }, isFull&&{color:'#999'}]}
                            tabbarActiveStyle={{ color: $.COLORS.mainColor }}
                            tablineStyle={[{ backgroundColor: $.COLORS.mainColor, height: 2 }]}
                            tablineHidden={isFull}
                            hideBorder={isFull}
                            isShowMore={false}
                            pageIndex={5}
                            navigator={navigator}>
                            {
                                this.now.nowArr.map((time, index) => (
                                    <ChannelList
                                        key={`item${index}`}
                                        navigator={navigator}
                                        now={this.now.now}
                                        channelId={channel.channelId}
                                        time={time}
                                        {...this.props}
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

const styles = StyleSheet.create({
    content: {
        flex: 1,
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
        marginRight: 16,
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
    },
    fullscreenItem:{
        color: '#999999',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    fullscreenPrograms:{
    },
    select:{
        color: '#019FE8'
    },
})
