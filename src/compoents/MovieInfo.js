import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    Share,
    TouchableOpacity,
    View,
} from 'react-native';

import Icons from '../compoents/Icon';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

    render(){
        const {onScrollToComment} = this.props;
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
                <TouchableOpacity style={styles.slidebtn} activeOpacity={.8}>
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
})