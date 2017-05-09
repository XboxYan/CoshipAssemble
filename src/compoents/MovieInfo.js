import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    Share,
    ScrollView,
    TouchableOpacity,
    View,
} from 'react-native';

import Icons from '../compoents/Icon';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoadView = () => (
    <View style={styles.conwrap}>
        <View style={[styles.loadview,styles.load01]}></View>
        <View style={[styles.loadview,styles.load02]}></View>
        <View style={[styles.loadview,styles.load03]}></View>
    </View>
)

class MovieDetail extends React.PureComponent {

    onBack = () => {
        const { navigator } = this.props;
        navigator.pop();
    }

    render() {
        return (
            <View style={[styles.conwrap,styles.content,styles.padBottomFix]}>
                <Text style={styles.title}>饥饿游戏（2012）</Text>
                <TouchableOpacity onPress={this.onBack} style={styles.slidebtn} activeOpacity={.8}>
                    <Icon name='clear' size={24} color={$.COLORS.subColor} />
                </TouchableOpacity>
                <ScrollView style={styles.content}>
                    <View style={[styles.conHorizon, styles.padH]}>
                        <Text style={styles.subtitle}>380.5次播放量</Text>
                        <Text style={styles.subtitle}>评分6.5</Text>
                        <Text style={styles.subtitle}>科幻片 | 恐怖片</Text>
                    </View>
                    <View style={styles.detailwrap}>
                        <Text style={styles.text}>一位国家部委的项目处长被人举报受贿千万，当最高人民检察院反贪总局侦查处处长侯亮平前来搜查时，看到的却是一位长相憨厚、衣着朴素的“老农民”在简陋破败的旧房里吃炸酱面/n
当这位腐败分子的面具被最终撕开的同时，与之案件牵连甚紧的汉东省京州市副市长丁义珍，却在一位神秘人物的暗中相助下，以反侦察手段逃脱法网，流亡海外。案件线索终定位于由京州光明峰项目引发的一家汉东省国企大风服装厂的股权争夺，牵连其中的各派政治势力却盘根错节，扑朔迷离。
汉东省检察院反贪局长陈海在调查行动中遭遇离奇的车祸。为了完成当年同窗的未竟事业，精明干练的侯亮平临危受命，接任陈海未竟的事业。在汉东省政坛，以汉东省委副书记、政法委书记高育良为代表的“政法系”，以汉东省委常委、京州市委书记李达康为代表的“秘书帮”相争多年，不分轩轾。新任省委书记沙瑞金的到来，注定将打破这种政治的平衡局面，为汉东省的改革大业带来新的气息。
</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default class extends React.PureComponent {

    onShare = () => {
        Share.share({
            message: 'React Native | A framework for building native apps using React',
        })
        .then((result)=>{
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    //
                }else{
                    //
                }
            }
        })
        .catch((error) => alert(error.message));
    }

    onShowMore = () => {
        const {navigator} = this.props;
        navigator.push({name:MovieDetail});
    }

    render(){
        const {onScrollToComment, isRender} = this.props;
        if(!isRender){
            return <LoadView />
        }
        return(
            <View style={styles.conwrap}>
                <Text style={styles.title}>饥饿游戏（2012）</Text>
                <View style={[styles.conHorizon,styles.padH]}>
                    <Text style={styles.subtitle}>380.5次播放量</Text>
                    <Text style={styles.subtitle}>评分6.5</Text>
                    <Text style={styles.subtitle}>科幻片 | 恐怖片</Text>
                </View>
                <View style={[styles.conHorizon,styles.social,,styles.padH]}>
                    <TouchableOpacity onPress={onScrollToComment} style={styles.conHorizon} activeOpacity={.8}>
                        <Image style={styles.icon} source={require('../../img/icon_comment.png')} />
                        <Text style={styles.comment}>评论</Text>
                    </TouchableOpacity>
                    <View style={styles.content}></View>
                    <TouchableOpacity onPress={this.onShare} style={[styles.iconWrap,styles.icoBtn]} activeOpacity={.8}>
                        <Image style={styles.icon} source={require('../../img/icon_share.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconWrap,styles.icoBtn]} activeOpacity={.8}>
                        <Icons style={styles.icon} icon={<Image style={styles.icon} source={require('../../img/icon_collect.png')} />} iconActive={<Image style={styles.icon} source={require('../../img/icon_collect.png')} />} active={false} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={this.onShowMore} style={styles.slidebtn} activeOpacity={.8}>
                    <Icon name='keyboard-arrow-down' size={30} color={$.COLORS.subColor} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    conwrap: {
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec'
    },
    padH:{
        paddingHorizontal: 10,
    },
    padBottomFix:{
        paddingBottom:0
    },
    conHorizon: {
        flexDirection:'row',
        alignItems: 'center',
    },
    icon:{
        width:24,
        height:24
    },
    title:{
        paddingHorizontal: 10,
        fontSize:16,
        color:'#333',
        paddingBottom: 10,
    },
    subtitle:{
        fontSize:14,
        color:'#9b9b9b',
        marginRight:12
    },
    comment:{
        marginLeft:2,
        fontSize:14,
        color:'#474747',
    },
    social:{
        paddingTop:20
    },
    icoBtn:{
        marginLeft:20
    },
    detailwrap: {
        paddingHorizontal: 10,
        paddingVertical: 15
    },
    text: {
        fontSize: 14,
        lineHeight: 20,
        color: $.COLORS.subColor
    },
    slidebtn:{
        position:'absolute',
        width:48,
        height:48,
        right:0,
        top:0,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadview:{
        backgroundColor:'#f1f1f1',   
        marginLeft:10,
    },
    load01:{
        width:40,
        height:24,
    },
    load02:{
        marginTop:10,
        height:18,
        width:200
    },
    load03:{
        marginTop:14,
        width:24,
        height:24,
        borderRadius:12
    },
})