/**
 * Created by 909753 on 2017/6/2.
 */
import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
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
import SmartContentList from './SmartContentList';

const EmptyView = () => (
    <View style={styles.flexcon}>
        <Text style={styles.castname}>暂时找不到内容~</Text>
    </View>
)

export default class extends PureComponent {

    state = {
        item: '',
        isRender: false,
        isContentList: false,
        ContentList: [],
        isEmpty:false
    }

    /**
     * 获取 内容详情数据
     * @param {*内容id} id
     */
    getContent(id) {
        // http://10.9.216.1:8000/SPSmartCMS/json/content_get.jspx?contentId=3138
        fetch(BASE_SMART+'json/content_get.jspx', {
            method: 'post',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: 'contentId=' + id + '&originType=3&userCardId=' + LoginStore.userCode
        }).then((response) => response.json())
            .then((item) => {

                this.setState({
                    item: item
                });
            })
            .catch((error) => {
                alert(error);
            });

    }

    /**
     * 获取 内容列表数据
     * @param {*栏目id} id
     */
    getContentList(id) {
        let url = `${BASE_SMART}json/content_list.jspx?channelIds[]=${id}&first=0&count=2`;
        fetch(url)
            .then((response) => response.json())
            .then((contentList) => {
                if (contentList.length > 1) {
                    this.setState({
                        isRender: true,
                        ContentList: contentList,
                        isContentList: true
                    });
                } else if (contentList.length == 1) {
                    this.setState({
                        isRender: true,
                        ContentList: contentList,
                    });
                } else {
                    this.setState({
                        isEmpty: true
                    });
                }
            })
            .catch((error) => {
                alert(error);
            });

    }

    componentWillMount() {

    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const id = this.props.route.item.id;
            const isContent = this.props.route.isContent;
            if (isContent) {
                // 详情页 获取内容详情
                //this.getContent(id);
                //this.reportView(id);
            }
            else {
                // 内容列表页 获取内容列表数据
                this.getContentList(id);
            }

        })

    }

    render() {
        const { navigator, route } = this.props;
        const { item } = route;
        const { isContent } = route;
        // alert(this.state.ContentList[0].releaseDate)


        if (isContent) {
            return (
                <SmartContent navigator={navigator} item={item} />
            )

        } else {
            if (!this.state.isRender) {
                return (
                    <View style={styles.container}>
                        <Appbar title={item.name} navigator={navigator} />
                        {
                            this.state.isEmpty?
                            <EmptyView />
                            :
                            <Loading />
                        }

                    </View>
                )
            }


            if (this.state.isContentList) {
                return (
                    <View style={styles.container}>
                        <Appbar title={item.name} navigator={navigator} />
                        <SmartContentList id={item.id} navigator={navigator} />
                    </View>
                )
            }

            return (
                <SmartContent navigator={navigator} item={this.state.ContentList[0]} />
            )
        }
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
        height: 48,
        marginTop: 2 / $.PixelRatio,
        justifyContent: 'center',
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row'
    },
    conHorizon: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    replytext: {
        marginLeft: 10,
        fontSize: 18,
        color: '#1E90FF',
    },
    icon: {
        width: 24,
        height: 24,
    },
    icon1: {
        padding: 8
    },
    icoBtn: {
        justifyContent: 'center',
        paddingHorizontal: 5,
        marginLeft: 10,
        flexDirection: 'row'
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
    input: {
        fontSize: 14,
        height: 30,
        paddingHorizontal: 15,
        paddingVertical: 0,
        borderRadius: 15,
        backgroundColor: '#f2f2f2',
        color: '#333',
        marginHorizontal: 25,
        marginBottom: 10
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
