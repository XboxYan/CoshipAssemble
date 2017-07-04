import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    ScrollView,
    FlatList,
    RefreshControl,
    UIManager,
    LayoutAnimation,
    ActivityIndicator,
    InteractionManager,
    View,
    TouchableOpacity,
} from 'react-native';

import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import Image from '../../compoents/Image'
import ScrollViewPager from '../../compoents/ScrollViewPager';
import Touchable from '../../compoents/Touchable';
import Loading from '../../compoents/Loading';
import LiveClientView from './LiveClientView';
import StartLivingView from './StartLiveView';
import LoginView from '../Me/LoginView';
import Store from '../../util/LoginStore';
import fetchLive from './FetchLive';
import Toast from 'react-native-root-toast'

const WatchEye = require('../../../img/interactivelive_temp_watch_eye.jpg')

@observer
class ListItem extends PureComponent {
    @observable watchNumber = null;

    @computed get canDisplayWatchNum() {
        return this.watchNumber != null;
    }

    constructor(props) {
        super(props)
    }

    onHandle = () => {
        const { navigator, item } = this.props;
        navigator.push({ name: LiveClientView, item })
    }

    componentDidMount() {
        this._getWatchNumber();
    }

    _getWatchNumber = () => {
        const { userCode } = this.props.item;

        fetchLive('queryOnlineNum', {
            resourceCode: userCode
        }, (data) => {
            InteractionManager.runAfterInteractions(() => {
                if (data.data) {
                    this.watchNumber = data.data.onlineNum;
                }
            })
        });
    }

    render() {
        const { item } = this.props;
        return (
            <Touchable style={styles.ListItemContainer} onPress={this.onHandle}>
                <View style={styles.itemPoster} >
                    <Image
                        source={{ uri: item.roomInfo.logo||'...' }}
                        style={styles.itemImg}
                        defaultSourceStyles={styles.itemImg}
                        defaultSource={require('../../../img/banner_moren.png')} />
                    <View style={styles.roomNameContainer}>
                        <Text numberOfLines={1} style={styles.roomName}>{item.roomInfo.title}</Text>
                    </View>
                </View>
                <View style={styles.infoContainer}>
                    <Image
                        source={{ uri: item.logo||'...' }}
                        style={styles.portrait}
                        defaultSourceStyles={styles.portrait}
                        defaultSource={require('../../../img/poster_moren.png')} />
                    <Text numberOfLines={1} style={styles.anchorName}>{item.nickName||item.userCode}</Text>
                    <View style={styles.watchInfo}>
                        <Image style={styles.watchEye} source={WatchEye} />
                        {
                            this.canDisplayWatchNum ?
                                <Text numberOfLines={1} style={styles.watchNumber}>{this.watchNumber}</Text>
                                :
                                <Text style={{ fontSize: 13 }}>加载中...</Text>
                        }

                    </View>
                </View>
            </Touchable>
        )

    }
}

const LoadView = (props) => (
    <View style={styles.loadView}>
        {
            props.isEnding ?
                <View style={styles.loadMore}>
                    <Text style={styles.loadText}>没有更多了 </Text>
                </View>
                :
                <View style={styles.loadMore}>
                    <ActivityIndicator size='small' color={$.COLORS.mainColor} />
                    <Text style={styles.loadText}>正在加载...</Text>
                </View>
        }
    </View>
)

@observer
class RoomList extends PureComponent {
    @observable userInfoList = [];
    @observable isRefresh = true;
    @observable isRender = false;
    @observable totalCount = 0;

    @observable getDataForRefresh = true;

    pageIndex = 1;

    @computed get isEnding() {
        return Number(this.totalCount) <= this.userInfoList.length;
    }

    @computed get haveResults() {
        return this.totalCount > 0;
    }

    componentDidMount() {
        this._getRoomList();
    }

    _getRoomList = () => {
        if (this.getDataForRefresh) {
            this.isRefresh = true;
        }

        const { columnId } = this.props;

        fetchLive('queryColumnUserInfoList', {
            columnId: columnId,
            queryType: 1,
            orderTag: 1,
            page: this.pageIndex,
            limit: 10
        }, (data) => {
            InteractionManager.runAfterInteractions(() => {
                this.userInfoList = [...this.userInfoList, ...data.dataList];
                this.isRefresh = false;
                this.totalCount = data.totalCount;
                this.isRender = true;
            })
        });
    }

    @action
    loadMore = () => {
        if (!this.isEnding) {
            this.pageIndex = this.pageIndex + 1;
            this.getDataForRefresh = false;
            this._getRoomList();
        }
    }

    renderItem = ({ item }) => {
        const { navigator } = this.props;
        return (<ListItem item={item.userInfo} navigator={navigator} />)
    }

    renderFooter = () => {
        return (
            this.haveResults ?
                <LoadView isEnding={this.isEnding} />
                :
                null
        )
    }

    @action
    onRefresh = () => {
        this.getDataForRefresh = true;
        this.userInfoList = [];
        //this.isRender=false;
        this.totalCount = 0;
        this.pageIndex = 1;
        this._getRoomList();
    }

    render() {
        return (
            <FlatList
                removeClippedSubviews={__ANDROID__}
                refreshControl={
                    <RefreshControl
                        onRefresh={this.onRefresh}
                        refreshing={this.isRefresh}
                        tintColor={$.COLORS.mainColor}
                        title="Loading..."
                        titleColor="#666"
                        colors={[$.COLORS.mainColor]}
                        progressBackgroundColor="#fff"
                    />
                }
                keyExtractor={(item, index) => index}
                ListFooterComponent={this.renderFooter}
                refreshing={this.isRefresh}
                data={this.userInfoList}
                onEndReached={this.loadMore}
                onEndReachedThreshold={0.1}
                renderItem={this.renderItem} />
        );
    }
}

@observer
export default class extends PureComponent {
    @observable columnList = null;

    @computed get isRender() {
        return this.columnList != null;
    }

    componentDidMount() {
        this._getColumnType();
    }

    @action
    _getColumnType = () => {
        fetchLive('getColumnType', {

        }, (data) => {
            InteractionManager.runAfterInteractions(() => {
                if (data.dataList && data.dataList.length > 0) {
                    this._getColumnList(data.dataList[0].columnTypeId);
                }
            })
        });
    }

    @action
    _getColumnList = (columnTypeId) => {
        fetchLive('getColumnList', {
            columnTypeId: columnTypeId
        }, (data) => {
            InteractionManager.runAfterInteractions(() => {
                if (data.dataList && data.dataList.length > 0) {
                    this.columnList = data.dataList;
                }
            })
        });
    }

    _startLiving = () => {
        const { navigator } = this.props;
        if (Store.needLogin) {
            navigator.push({ name: LoginView })
            return;
        }
        if (!Store.isAnchor) {
            Toast.show('你暂时还无法开播，请在个人中心申请成为主播');
            return;
        }
        navigator.push({ name: StartLivingView })
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { navigator } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                {
                    this.isRender ? (
                        <View style={{ flex: 1, backgroundColor: 'white' }}>
                            <ScrollViewPager
                                bgColor='#fff'
                                tabbarHeight={34}
                                tabbarStyle={{ color: '#474747', fontSize: 16 }}
                                tabbarActiveStyle={{ color: $.COLORS.mainColor }}
                                tablineStyle={{ backgroundColor: $.COLORS.mainColor, height: 2 }}
                                tablineHidden={false}
                                navigator={navigator}>
                                {
                                    this.columnList.map((item) => <RoomList key={item.rank} columnId={item.columnId}
                                        navigator={navigator}
                                        tablabel={item.columnName} />)
                                }
                            </ScrollViewPager>
                            <TouchableOpacity activeOpacity={0.8} style={styles.floatButton} onPress={this._startLiving}>
                                <Image style={styles.floatImg} source={require('../../../img/living_float_btn.png')} />
                            </TouchableOpacity>
                        </View>
                    )
                        :
                        <Loading />
                }

            </View>
        )
    }
}

const styles = StyleSheet.create({
    ListItemContainer: {
        width: $.WIDTH,
        height: 0.75 * $.WIDTH + 50,
    },
    itemPoster: {
        width: $.WIDTH,
        height: 0.75 * $.WIDTH,
    },
    itemImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover'
    },
    infoContainer: {
        width: $.WIDTH,
        height: 50,
        paddingVertical: 5,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    portrait: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
        borderRadius: 20
    },
    roomNameContainer: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        left: 0,
        bottom: 0,
        width: $.WIDTH,
        height: 30,
        paddingHorizontal: 10
    },
    roomName: {
        color: 'white',
        fontSize: 14
    },
    anchorName: {
        fontSize: 14,
        color: 'black',
        marginLeft: 5,
        flex: 1
    },
    watchInfo: {
        flexDirection: 'row',
        width: 100,
        height: 40,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginLeft: 20
    },
    watchEye: {
        width: 20,
        height: 20,
        resizeMode: 'stretch'
    },
    watchNumber: {
        marginLeft: 5,
        fontSize: 14,
        color: '#bababa',
    },
    floatButton: {
        position: 'absolute',
        right: 30,
        bottom: 24,
    },
    floatImg: {
        width: 68,
        height: 74,
    },
    loadMore: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loadView: {
        padding: 20,
        alignItems: 'center',
    },
    loadText: {
        color: '#ccc',
        fontSize: 14,
        paddingHorizontal: 5
    }
})
