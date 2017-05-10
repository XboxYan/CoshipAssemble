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

import Appbar from '../compoents/Appbar';
import Loading from '../compoents/Loading';
import ScrollViewPager from '../compoents/ScrollViewPager';
import Touchable from '../compoents/Touchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LiveContentView from './LiveContentView';

class ChannelItem extends PureComponent {
    onhandle = ()=>{
        const {navigator} = this.props;
        navigator.push({
            name:LiveContentView
        })
    }
    render(){
        return(
            <Touchable style={styles.channelitem} onPress={this.onhandle} >
                <View style={styles.channelimgWrap}>
                    <Image style={styles.channelimg} source={require('../../img/img02.png')} />
                </View>
                <View style={styles.channeltext}>
                    <Text numberOfLines={1} style={styles.channelname}>东方卫视</Text>
                    <View style={styles.channeldtail}>
                        <Icon name='play-circle-outline' size={13} color={$.COLORS.mainColor} />
                        <Text style={[styles.channelinfo,{color:$.COLORS.mainColor}]}>正在播放</Text>
                        <Text style={[styles.channelinfo,{color:$.COLORS.mainColor}]}>幸福总动员</Text>
                    </View>
                    <View style={styles.channeldtail}>
                        <Text style={styles.channelinfo}>12:10</Text>
                        <Text style={styles.channelinfo}>高能少年团</Text>
                    </View>
                </View>
            </Touchable>
        )
    }
}

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
        return <ChannelItem navigator={navigator} />
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

export default class extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRender:false,
        }
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {

        })
    }
    handleSelecet = (postion,index) => {

    }
    render(){
        const {navigator,route}=this.props;
        //const {isRender,data,selected}=this.state;
        return (
            <View style={styles.content}>
                <Appbar title="直播" isBack={false} />
                <ScrollViewPager 
                    bgColor='#fff'
                    tabbarHeight={34}
                    tabbarStyle={{color:'#474747',fontSize:16}}
                    tabbarActiveStyle={{color:$.COLORS.mainColor}}
                    tablineStyle={{backgroundColor:$.COLORS.mainColor,height:2}}
                    tablineHidden={false}
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

const styles = StyleSheet.create({
  content: {
    flex:1
  },
  channelitem:{
    height:74,
    justifyContent:'center',
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#fff'
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
    height:40
  },
  channeltext:{
    flex:1,
    justifyContent:'center',
  },
  channelname:{
    fontSize:14,
    color:'#333'
  },
  channeldtail:{
    flexDirection:'row',
    marginTop:4
  },
  channelinfo:{
    fontSize:12,
    color:'#9b9b9b',
    marginRight:12
  },
  classifyel:{
    height:30,
    justifyContent: 'center',
    paddingHorizontal:15,
    borderRadius:15
  },
  classifyActive:{
    backgroundColor:$.COLORS.mainColor,
  },
  classifytext:{
    color:'#474747',
    fontSize:14
  },
  classifytextActive:{
    color:'#fff'
  },
  movielist:{
    flex:1,
    backgroundColor:'#fff',
    paddingTop:10,
    marginTop:7
  }
})