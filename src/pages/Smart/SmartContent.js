import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    FlatList,
    UIManager,
    ActivityIndicator,
    LayoutAnimation,
    InteractionManager,
    WebView,
    TextInput,
    View,
    TouchableOpacity,
    Share,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Appbar from '../../compoents/Appbar';
import Loading from '../../compoents/Loading';
import moment from 'moment';
import LoginStore from '../../util/LoginStore';
import fetchData from '../../util/Fetch';
import Image from '../../compoents/Image';

import { observer } from 'mobx-react/native';
import { observable, computed, action } from 'mobx';
import LoginView from '../Me/LoginView';
import Touchable from '../../compoents/Touchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SmartContent from './SmartContent';

export default class extends PureComponent {

    state = {
        views: 0,
        isRender: false,
    }

    /**
     * 上报 浏览记录
     * @param {*内容id} id
     */
    reportView(id) {
        fetch(BASE_SMART + 'json/content_addView.jspx', {
            method: 'post',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: 'contentId=' + id + '&originType=3&userCardId=' + LoginStore.userCode
        }).then((response) => response.json())
            .then((item) => {

                this.setState({
                    views: item.views ? item.views : 0
                });
            })
            .catch((error) => {
                alert(error);
            });
    }
    onShare = () => {
        Share.share({
            message: 'React Native | A framework for building native apps using React',
        })
            .then((result) => {
                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        //
                    } else {
                        //
                    }
                }
            })
            .catch((error) => alert(error.message));
    }

    onComments = () => {
        const { navigator } = this.props;
        navigator.push({ name: CommentDetail, id: this.props.item.id, SceneConfigs: 'FloatFromBottomAndroid' });
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const id = this.props.item.id;
            this.reportView(id);
            this.setState({ isRender: true })
        })

    }

    render() {
        const { isRender } = this.state;
        const { navigator, item } = this.props;
        const ico = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAAqCAYAAADvczj0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4RpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo5MWI0ODA2My00ZWRmLTZkNDEtYjdjMi1hZjQ0MmY5NTU1MDYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0RDQjk0MTc1QTE3MTFFNzg2Q0NCMkJDQ0IwQUM2NzMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0RDQjk0MTY1QTE3MTFFNzg2Q0NCMkJDQ0IwQUM2NzMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6ZGJiMTZkNWEtYTFjOC0xODQ5LWJjMzktZTJmNjliYWZlYjA1IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZjEzZGU5NmUtNTBkNS0xMWU3LWFhNmMt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`;
        return (
            <View style={styles.container}>
                <Appbar title='详情' navigator={navigator} />
                {
                    isRender ?
                        <WebView
                            style={{ flex: 1, backgroundColor: 'white' }}
                            source={{
                                headers: `
                                    <meta charset="utf-8">
                                    <meta http-equiv=X-UA-Compatible content="IE=edge">
                                    <meta name=format-detection content="telephone=no">
                                    <meta name=format-detection content="email=no">
                                    <meta name=apple-mobile-web-app-capable content=yes>
                                    <meta name=apple-mobile-web-app-status-bar-style content=black>
                                    <meta name=full-screen content=yes>
                                    <meta name=browsermode content=application>
                                    <meta name=x5-orientation content=portrait>
                                    <meta name=x5-fullscreen content=true>
                                    <meta name=x5-page-mode content=app>
                                    <meta name=viewport content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no,minimal-ui">
                                    `,
                                html: `
                                <h2 style="font-size:20px; margin:0; color:#333; padding:10px 0">${item.title}</h2>
                                <div style="height: 20px;line-height:20px;font-size:14px;color:#999;position:relative;">
                                    <div style="position:absolute;left:0; top:0;height:20px;line-height:20px;">
                                        ${(item.origin ? item.origin : '未知来源') + '&nbsp' + (item.releaseDate ? moment(item.releaseDate, 'YYYYMMDDHHmmss').format('MM-DD HH:mm') : '')}
                                    </div>
                                    <div style="position:absolute;right:0; top:0;height:20px;line-height:20px;padding-left:20px;">
                                        <img style="position:absolute;left:0;top:3px;width:20px;" src=${ico} />
                                        ${this.state.views}
                                    </div>
                                </div>
                                <div style="text-align: center;${item.attr ? "padding:10px 0" : ""}">
                                    <img style="max-width:100%;" src=${item.attr ? item.attr.titlePic : ''} />
                                </div>
                                ${item.txt ? item.txt : '无'}
                                `,
                                baseUrl: ''
                            }}
                            javaScriptEnabled={true}
                            domStorageEnabled={true}
                            renderLoading={() => <Loading />}
                            startInLoadingState={true}
                            scalesPageToFit={true}
                        />
                        : <Loading />

                }
                <View style={styles.bottomBar}>
                    <TouchableOpacity onPress={this.onComments} style={styles.conHorizon} activeOpacity={.8}>
                        <Text style={[styles.replytext, { color: $.COLORS.mainColor }]}>查看评论</Text>
                    </TouchableOpacity>
                    {
                        // <TouchableOpacity onPress={this.onShare} style={styles.icoBtn} activeOpacity={.8}>
                        //     <Image style={styles.icon} source={require('../../../img/icon_share.png')} />
                        // </TouchableOpacity>
                        // <TouchableOpacity style={styles.icoBtn} activeOpacity={.8}>
                        //     <Image style={styles.icon} source={require('../../../img/icon_praise.png')} />
                        //     <Text style={styles.viewtext} >{item.views ? (item.views + '') : '0'}</Text>
                        // </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}

const CommentItem = (props) => (
    <View style={styles.commentitem}>
        <View style={styles.headwrap}>
            <Image
                style={styles.head}
                defaultSource={require('../../../img/actor_moren.png')}
                source={{ uri: Base + props.item.logo }} />
        </View>
        <View style={styles.content}>
            <View style={styles.info}>
                <Text style={styles.name}>{props.item.userName || props.item.userCode}</Text>
                <Text style={styles.date}>{props.item.creatTime}</Text>
            </View>
            <Text style={styles.msg}>{props.item.comment}</Text>
        </View>
    </View>
)

const LoadView = (props) => (
    <View style={styles.loadview}>
        {
            props.isEnding ?
                <View style={styles.loadmore}>
                    <Text style={styles.loadtext}>没有更多了 </Text>
                </View>
                :
                <View style={styles.loadmore}>
                    <ActivityIndicator size='small' color={$.COLORS.mainColor} />
                    <Text style={styles.loadtext}>正在加载评论...</Text>
                </View>
        }
    </View>
)

const CommentEmpty = () => (
    <View style={styles.flexcon}>
        <Text>没有找到评论！</Text>
    </View>
)

@observer
class CommentList extends PureComponent {

    renderFooter = () => {
        const { data } = this.props;
        if (data.length > 0) {
            const { onEndReached, isEnding = false } = this.props;
            if (onEndReached) {
                return <LoadView isEnding={isEnding} />;
            } else {
                return null;
            }
        } else {
            return <CommentEmpty />;
        }
    }

    renderItem({ item, index }) {
        return <CommentItem item={item} />
    }

    render() {
        const { data, isRender, onEndReached = () => { } } = this.props;
        if (!isRender) {
            return <Loading text='正在加载评论...' size='small' height={100} />
        }
        return (
            <FlatList
                removeClippedSubviews={__ANDROID__}
                keyExtractor={(item) => item.creatTime}
                ListFooterComponent={this.renderFooter}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.1}
                data={data}
                renderItem={this.renderItem}
            />
        )
    }
}

@observer
class CommentDetail extends PureComponent {

    objID = '';

    providerId = '';

    @observable
    pageIndex = 1;

    @observable
    text = '';

    @observable
    pageSize = 10;

    @observable
    data = [];

    @observable
    isRender = false;

    @observable
    size = 0;

    @computed
    get isEnding() {
        return this.size === this.data.length;
    }

    @action
    loadMore = () => {
        if (!this.isEnding) {
            this.pageIndex = this.pageIndex + 1;
            this._fetchData();
        }
    }

    onBack = () => {
        const { navigator } = this.props;
        navigator.pop();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.objID = this.props.route.id;
            this.providerId = 'smart';
            this._fetchData();
        })
    }

    onSubmit = () => {
        const { navigator } = this.props;
        if (LoginStore.loginState) {
            if (this.text) {
                this.addComment(this.text);
                this.text = '';
            }
        } else {
            navigator.push({ name: LoginView });
        }
    }

    onEdit = (text) => {
        this.text = text;
    }

    _fetchData = () => {
        fetchData('GetComments', {
            par: {
                objID: this.objID,
                providerId: this.providerId,
                startAt: this.pageIndex,
                maxItems: this.pageSize,
                objType: 4
            }
        }, (data) => {
            if (data.ret === '0') {
                this.isRender = true;
                this.size = Number(data.totolCount);
                this.data = [...this.data, ...data.commitList];
            }
        })
    }

    addComment = (comment) => {
        fetchData('UserComment', {
            par: {
                objID: this.objID,
                providerId: this.providerId,
                comment,
                objType: 4
            }
        }, (data) => {
            if (data.code === '0') {
                Toast.show('评论成功~');
                this.size += 1;
                this.data = [{
                    "comment": comment,
                    "objID": moment().format("YYYY-MM-DD H:mm:ss"),
                    "creatTime": moment().format("YYYY-MM-DD H:mm:ss"),
                    "logo": LoginStore.userInfo.logo,
                    "userName": LoginStore.userInfo.nickName || LoginStore.userCode
                }, ...this.data]
            } else {
                Toast.show(data.message);
            }
        })
    }

    render() {
        return (
            <View style={[styles.conwrap, styles.content]}>
                <Text style={styles.title}>全部评论({this.size}){this.startAt}</Text>
                <CommentList
                    isRender={this.isRender}
                    onEndReached={this.loadMore}
                    isEnding={this.isEnding}
                    data={this.data} />
                <View style={styles.inputwarp}>
                    <TextInput
                        style={styles.input}
                        value={this.text}
                        selectionColor={$.COLORS.mainColor}
                        underlineColorAndroid='transparent'
                        onSubmitEditing={this.onSubmit}
                        onChangeText={this.onEdit}
                        placeholder='我来说两句'
                        returnKeyLabel='评论'
                        placeholderTextColor='#909090'
                    />
                </View>
                <TouchableOpacity onPress={this.onBack} style={styles.slidebtn} activeOpacity={.8}>
                    <Icon name='clear' size={24} color={$.COLORS.subColor} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#f2f2f2',
    },
    titleview: {
        justifyContent: 'center',
        paddingVertical: 12,
        backgroundColor: '#fff'
    },
    titletext: {
        fontSize: 20,
        textAlign: 'center',
        color: '#333',
    },
    textView: {
        height: 20,
        flexDirection: 'row',
        backgroundColor: '#fff'
    },
    origintext: {
        marginLeft: 10,
        fontSize: 14,
        color: '#999',
    },
    datetext: {
        marginLeft: 10,
        fontSize: 14,
        color: '#999',
        flex: 1
    },
    // 访问量
    viewheader: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 20,
        paddingHorizontal: 5,
        flexDirection: 'row'
    },
    viewico: {
        padding: 2,
        width: 18,
        height: 14
    },
    viewtext: {
        fontSize: 14,
        color: '#999',
        marginLeft: 5,
        marginRight: 10
    },

    bottomBar: {
        height: 50,
        marginTop: 1 / $.PixelRatio,
        justifyContent: 'center',
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row'
    },
    conHorizon: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        flex: 1
    },
    replytext: {
        marginLeft: 10,
        fontSize: 16,
    },
    icon: {
        width: 20,
        height: 20,
    },
    icon1: {
        padding: 8
    },
    icoBtn: {
        justifyContent: 'center',
        paddingHorizontal: 5,
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    farovtext: {
        fontSize: 18,
        color: '#333',
        marginTop: 5,
        marginRight: 5,
    },

    content: {
        flex: 1,
        backgroundColor: '#fff',
    },
    conwrap: {
        paddingTop: 20,
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec'
    },
    title: {
        padding: 10,
        fontSize: 16,
        color: '#333',

    },
    num: {
        position: 'absolute',
        right: 15,
        top: 20,
        color: '#9b9b9b',
        fontSize: 12,
        zIndex: 10,
    },
    inputwarp: {
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec',
        height: 50,
        justifyContent: 'center'
    },
    input: {
        fontSize: 14,
        height: 30,
        paddingHorizontal: 15,
        paddingVertical: 0,
        borderRadius: 15,
        backgroundColor: '#f2f2f2',
        color: '#333',
        marginHorizontal: 10,
    },
    commentlist: {
        paddingTop: 0
    },
    commentitem: {
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec',
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        marginBottom: 10
    },
    headwrap: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 5,
        overflow: 'hidden',
        backgroundColor: '#f1f1f1',
    },
    head: {
        width: 30,
        height: 30,
        resizeMode: 'cover',
        borderRadius: 15,
    },
    info: {
        height: 30,
        justifyContent: 'center',
    },
    name: {
        fontSize: 14,
        color: $.COLORS.mainColor
    },
    date: {
        marginTop: 2,
        fontSize: 12,
        color: $.COLORS.subColor
    },
    msg: {
        marginTop: 15,
        fontSize: 13,
        color: '#474747',
        lineHeight: 20
    },
    headImage: {
        width: 56,
        height: 56,
        resizeMode: 'cover',
        borderRadius: 28,
    },
    castname: {
        fontSize: 14,
        color: '#333',
        paddingTop: 12
    },
    flexcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20
    },
    loadview: {
        padding: 15,
        alignItems: 'center',
    },
    loadtext: {
        color: '#ccc',
        fontSize: 14,
        paddingHorizontal: 5
    },
    loadmore: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    commentmore: {
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 50
    },
    commentmoretext: {
        color: $.COLORS.mainColor,
        fontSize: 14
    },
    slidebtn: {
        position: 'absolute',
        width: 48,
        height: 48,
        right: 0,
        top: 16,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    epistotal: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        height: 48,
        top: 0,
        right: 0
    },
    totaltext: {
        fontSize: 12,
        color: '#9b9b9b',
    },
});
