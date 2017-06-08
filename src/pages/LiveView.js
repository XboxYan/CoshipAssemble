import React, { PureComponent } from 'react';
import {
  StyleSheet,
  InteractionManager,
  UIManager,
  Image,
  FlatList,
  LayoutAnimation,
  Text,
  View,
} from 'react-native';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import moment from 'moment';

import fetchData, {getLogo} from '../util/Fetch';
import Appbar from '../compoents/Appbar';
import Loading from '../compoents/Loading';
import ScrollViewPager from '../compoents/ScrollViewPager';
import Touchable from '../compoents/Touchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LiveContentView from './Live/LiveContentView';

const defaultSource = require('../../img/img02.png');

@observer
class ChannelItem extends PureComponent {
    @observable loadFail = false;

    @computed get loadUri(){
        const {channel} = this.props;
        return channel.logo && channel.logo.length>0 && !this.loadFail;
    }

    constructor(props){
        super(props)
    }

    onhandle = ()=>{
        const {navigator, channel} = this.props;
        navigator.push({
            name:LiveContentView,
            channel: channel
        })
    }

    _getProgramName = (program) =>{
        return program ? program.programName : '暂无节目单';
    }

    render(){
        const {channel} = this.props;
        const {logo, program} = channel;
        const currentProgram = program && program.length>0 ? program[0] : null;
        const currentProgramName = currentProgram ? currentProgram.programName : '暂无节目单';
        const nextProgram = program && program.length>1 ? program[1] : null;
        const nextProgramTime = nextProgram ? moment(nextProgram.endDateTime, 'YYYYMMDDHHmmss').format('mm:ss') : '';
        const nextProgramName = nextProgram ? nextProgram.programName : '';
        return(
            <Touchable style={styles.channelitem} onPress={this.onhandle} >
                <View style={styles.channelimgWrap}>
                    <Image style={styles.channelimg}
                        source={this.loadUri ?  {uri:fetchData.getLogo(logo) } : defaultSource}
                        onError={()=>this.loadFail = true}
                    />
                </View>
                <Text style={{lineHeight:20}}>
                    <Text numberOfLines={1} style={styles.channelname}>{channel.channelName}{'\n'}</Text>
                    <Text >
                        <Icon name='play-circle-outline' size={12} color={$.COLORS.mainColor} />
                        <Text style={[styles.channelinfo,{color:$.COLORS.mainColor}]}>正在播放{'   '}</Text>
                        <Text numberOfLines={1} style={[styles.channelinfo,{color:$.COLORS.mainColor}]}>{currentProgramName}{'\n'}</Text>
                    </Text>
                    <Text>
                        <Text style={styles.channelinfo}>{nextProgramTime}{'\t'}</Text>
                        <Text numberOfLines={1} style={styles.channelinfo}>{nextProgramName}</Text>
                    </Text>
                </Text>
            </Touchable>
        )
    }
}

@observer
class ChannelList extends PureComponent {

    @observable channelList = null;
    @observable isRefresh=false;

    @computed get isRender(){
        return this.channelList != null;
    }


    componentDidMount(){
        this._loadChannels();
    }

    @action
    _loadChannels = () => {
        this.isRefresh = true;
        const {category} = this.props;
        fetchData('GetChannels',{
            par:{
                channelType:category.categoryId,
                containPrograms:'Y',
            }
  		},(data)=>{
            InteractionManager.runAfterInteractions(() => {
  				const channels = data.channel ? data.channel : [];
                this.channelList = this.channelList ? this.channelList.replace(channels) : channels;
                this.isRefresh = false;
            })
  		})
    }

    renderItem = ({item,index}) => {
        const {navigator} = this.props;
        return <ChannelItem key={index} channel={item} navigator={navigator} />
    }
    render(){
        return(<View style={styles.content}>
            {
                this.isRender?
                <FlatList
                    onRefresh={this._loadChannels}
                    refreshing={this.isRefresh}
                    keyExtractor={(item, index) => item.channelId}
                    data={this.channelList.slice()}
                    getItemLayout={(channelList, index) => ( {length: channelList.length, offset: 74 * index, index} )}
                    renderItem={this.renderItem}
                />
                :<Loading />
            }
        </View>
        )
    }
}

@observer
export default class extends PureComponent {

    @observable channelCategories = null;

    @computed get isRender(){
        return this.channelCategories != null;
    }

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    @action
    componentDidMount(){
      fetchData('GetChannels',{
            par:{
                maxItems:1
            }
  		},(data)=>{
            InteractionManager.runAfterInteractions(() => {
                this.channelCategories = data.categorys && data.categorys.category ? data.categorys.category :[];
            })
  		})
    }

    handleSelecet = (postion,index) => {

    }
    render(){
        const {navigator,route}=this.props;
        return (
            <View style={styles.content}>
                <Appbar title="直播" isBack={false} />
                {
                    this.isRender ?
                    <ScrollViewPager
                        bgColor='#fff'
                        tabbarHeight={34}
                        tabbarStyle={{color:'#474747',fontSize:16}}
                        tabbarActiveStyle={{color:$.COLORS.mainColor}}
                        tablineStyle={{backgroundColor:$.COLORS.mainColor,height:2}}
                        tablineHidden={false}
                        navigator={navigator}>
                        {
                            this.channelCategories.map((item) => <ChannelList key={item.categoryId} category={item} navigator={navigator} tablabel={item.categoryName} />)
                        }
                    </ScrollViewPager>
                    : <Loading />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
  content: {
    flex:1
  },
  channelitem:{
    height:74,
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#fff',
  },
  channelimgWrap:{
    width:60,
    height:60,
    marginHorizontal:10,
    borderRadius:35,
    borderWidth:1/$.PixelRatio,
    borderColor:'#e5e5e5',
    alignItems:'center',
    justifyContent:'center'
  },
  channelimg:{
    width:40,
    height:40,
  },
  channelname:{
    fontSize:14,
    color:'#333',
  },
  channelinfo:{
    fontSize:12,
    color:'#9b9b9b',
    marginRight:12
  },
})
