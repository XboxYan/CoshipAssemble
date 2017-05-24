import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    FlatList,
    View,
} from 'react-native';

import fetchData from '../../util/Fetch'
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
        const {playInfo, program} = this.props;
        return playInfo.currentPlayProgram.programId == program.programId;
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
                this.isSubscribe = !this.isSubscribe;
                break;
        }
    }

    render(){
        const { program, isFull } = this.props;
        return (<Touchable style={[styles.channelitem, isFull&&{backgroundColor:'rgba(0,0,0,0)'}]} onPress={this._play}>
            <Text style={[styles.channelTime, this.isSelect&& styles.select]}>{program.startMoment.format('HH:mm')}</Text>
            <Text numberOfLines={1} style={[styles.channelInfo, this.isSelect&& styles.select]}>{program.programName}</Text>
            <TouchableOpacity activeOpacity={.5} style={[styles.channelaction, this.isSelect && {borderWidth:0}]}>
                <Text style={[styles.channelactiontxt, this.isSelect&& styles.select]}>{this.actionText}</Text>
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
        const { channelId, now, time, playInfo} = this.props;
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
                    },300)
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
        const { navigator, isRender, channel, ...others} = this.props;
        return (
            <View style={styles.content}>
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
                                        channelId={channel.channelId}
                                        time={time}
                                        {...others}
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
        flex: 1
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
    },
    select:{
        color: '#019FE8'
    },
    fullScreen:{
        backgroundColor: 'rgba(0,0,0,0)'
    }
})
