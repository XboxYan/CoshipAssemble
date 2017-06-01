import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    Share,
    ScrollView,
    UIManager,
    LayoutAnimation,
    TouchableOpacity,
    View,
} from 'react-native';

import Icons from '../../compoents/Icon';
import Loading from '../../compoents/Loading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import fetchData from '../../util/Fetch';

import { observer } from 'mobx-react/native';

const LoadView = () => (
    <View style={styles.conwrap}>
        <View style={[styles.loadview,styles.load01]}></View>
        <View style={[styles.loadview,styles.load02]}></View>
        <View style={[styles.loadview,styles.load03]}></View>
    </View>
)

class MovieDetail extends PureComponent {
    state = {
        data:null,
        isRender:false
    }

    onBack = () => {
        const { navigator } = this.props;
        navigator.pop();
    }

    _fetchData = () => {
        const { assetId } = this.props.route;
        fetchData('GetItemData',{
            par:{
                titleAssetId:assetId
            }
        },(data)=>{
            this.setState({
                data: data.selectableItem,
                isRender: true
            })
        })
    }

    render() {
        const { data } = this.props.route.Store.StoreInfo;
        return (
            <View style={[styles.conwrap,styles.content,styles.padBottomFix]}>
                <Text style={styles.title}>{data.titleFull}</Text>
                <TouchableOpacity onPress={this.onBack} style={styles.slidebtn} activeOpacity={.8}>
                    <Icon name='clear' size={24} color={$.COLORS.subColor} />
                </TouchableOpacity>
                <ScrollView style={styles.content}>
                    <View style={[styles.conHorizon, styles.padH]}>
                        <Text style={styles.subtitle}>{data.assetType}</Text>
                    </View>
                    <View style={styles.detailwrap}>
                        <Text style={styles.text}>{data.summarMedium}</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

@observer
export default class extends PureComponent {

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentWillUpdate() {
        //LayoutAnimation.spring();
    }

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
        const {navigator,Store} = this.props;
        navigator.push({name:MovieDetail,Store:Store});
    }

    render(){
        const { onScrollToComment,Store } = this.props;
        const {StoreInfo} = Store;
        const isRender = Store.isRender&&StoreInfo.isRender;
        return(
            <View style={styles.conwrap}>
                <Text style={styles.title}>{Store.title}</Text>
                <View style={[styles.conHorizon,styles.padH]}>
                    <Text style={styles.subtitle}>{isRender?StoreInfo.data.assetType:'描述加载中...'}</Text>
                </View>
                <View style={[styles.conHorizon,styles.social,,styles.padH]}>
                    <TouchableOpacity onPress={onScrollToComment} style={styles.conHorizon} activeOpacity={.8}>
                        <Image style={styles.icon} source={require('../../../img/icon_comment.png')} />
                        <Text style={styles.comment}>评论</Text>
                    </TouchableOpacity>
                    <View style={styles.content}></View>
                    <TouchableOpacity onPress={this.onShare} style={[styles.iconWrap,styles.icoBtn]} activeOpacity={.8}>
                        <Image style={styles.icon} source={require('../../../img/icon_share.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconWrap,styles.icoBtn]} activeOpacity={.8}>
                        <Icons style={styles.icon} icon={<Image style={styles.icon} source={require('../../../img/icon_collect.png')} />} iconActive={<Image style={styles.icon} source={require('../../../img/icon_collect.png')} />} active={false} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity disabled={!StoreInfo.isRender} onPress={this.onShowMore} style={styles.slidebtn} activeOpacity={.8}>
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
        paddingLeft: 10,
        paddingRight:50,
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
    },
    load01:{
        width:40,
        height:24,
        borderRadius:12,
        marginLeft:10,
    },
    load02:{
        marginTop:10,
        borderRadius:9,
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