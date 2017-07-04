import React, {PureComponent, PropTypes} from 'react';
import {
    StyleSheet,
    Text,
    UIManager,
    ActivityIndicator,
    LayoutAnimation,
    InteractionManager,
    FlatList,
    View,
} from 'react-native';

import Touchable from '../../compoents/Touchable';
import fetchLive from '../InteractiveLive/FetchLive'
import LiveClientView from '../InteractiveLive/LiveClientView'
import Loading from '../../compoents/Loading';
import Image from '../../compoents/Image';

import {observable, action, computed, autorun} from 'mobx';
import {observer} from 'mobx-react/native';

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
        const {navigator, item} = this.props;
        navigator.push({name: LiveClientView, item})
    }

    componentDidMount() {
        this._getWatchNumber();
    }

    _getWatchNumber = () => {
        const {userCode} = this.props.item;

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
        const {item} = this.props;
        return (
            <Touchable style={styles.ListItemContainer} onPress={this.onHandle}>
                <View style={{width:$.WIDTH,height:0.75*$.WIDTH}}>
                    <Image source={{uri: item.roomInfo.logo}} style={styles.itemPoster}/>
                    <View style={styles.roomNameContainer}>
                        <Text numberOfLines={1} style={styles.roomName}>{item.roomInfo.title}</Text>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <Image source={{uri: item.logo}} style={styles.portrait}/>
                    <Text numberOfLines={1} style={styles.anchorName}>{item.nickName}</Text>
                    <View style={styles.watchInfo}>
                        <Image style={styles.watchEye} source={ WatchEye}/>
                        {
                            this.canDisplayWatchNum ?
                                <Text numberOfLines={1} style={styles.watchNumber}>{this.watchNumber}</Text>
                                :
                                <Text style={{fontSize: 13}}>加载中...</Text>
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
                    <ActivityIndicator size='small' color={$.COLORS.mainColor}/>
                    <Text style={styles.loadText}>正在加载...</Text>
                </View>
        }
    </View>
)

const Empty = () => (
    <View style={styles.flexCon}>
        <Text>没有搜索结果！</Text>
    </View>
)

@observer
export default class extends PureComponent {
    @observable searchwords = '';
    @observable userInfoList = [];
    @observable totalCount = 0;
    @observable isRender=false;

    pageIndex = 1;

    @computed get haveResults() {
        return this.totalCount > 0;
    }

    @computed get isEnding() {
        return Number(this.totalCount) === this.userInfoList.length;
    }

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    @action
    componentDidMount() {
        const {searchwords} = this.props;
        this.searchwords = searchwords;
        this.getData();
    }

    @action
    componentWillUpdate(nextProps, nextState) {
        if (nextProps.searchwords != this.props.searchwords) {
            this.pageIndex = 1;
            this.userInfoList = [];
            this.isRender=false;
            this.totalCount=0;
            this.searchwords = nextProps.searchwords;
            this.getData();
        }
    }

    getData = () => {
        fetchLive('searchKeyWord', {
            page:this.pageIndex,
            keyWord:this.searchwords,
            limit:10

        }, (data) => {
            InteractionManager.runAfterInteractions(() => {
                if (data.dataList) {
                    this.userInfoList = [...this.userInfoList,...data.dataList];
                    this.totalCount = data.totalCount;
                    this.isRender=true;
                }
            })
        });
    }

    @action
    loadMore = () => {
        if (!this.isEnding) {
            this.pageIndex = this.pageIndex + 1;
            this.getData();
        }
    }

    renderItem = ({item}) => {
        const {navigator} = this.props;
        return (<ListItem item={item.userInfo} navigator={navigator}/>)
    }

    renderFooter = () => {
        return (
            this.haveResults ?
                <LoadView isEnding={this.isEnding}/>
                :
                <Empty/>
        )
    }

    render() {
        return (
            this.isRender ?
                <FlatList
                    style={styles.content}
                    numColumns={1}
                    keyExtractor={(item, index) => index}
                    ListFooterComponent={this.renderFooter}
                    data={this.userInfoList}
                    onEndReached={this.loadMore}
                    onEndReachedThreshold={0.1}
                    renderItem={this.renderItem}/>
                :
                <Loading size='small' text=''/>
        )
    }
}

const styles = StyleSheet.create({
    content:{
        flex:1,
        backgroundColor:'white'
    },
    ListItemContainer: {
        width: $.WIDTH,
        height: 0.75 * $.WIDTH + 50,
    },
    itemPoster: {
        width: $.WIDTH,
        height: 0.75 * $.WIDTH,
        resizeMode: 'stretch'
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
        paddingHorizontal: 10,
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
    },
    flexCon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
})