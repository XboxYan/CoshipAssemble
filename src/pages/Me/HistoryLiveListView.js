import React, {Component} from 'react';

import{
    View,
    StyleSheet,
    TextInput,
    ListView,
    TouchableOpacity,
    Button,
    Image,
    TouchableHighlight,
    InteractionManager,
    Picker,
    ToastAndroid,
    SectionList,
    Text
} from 'react-native';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

import Touchable from '../../compoents/Touchable';
import Loading from '../../compoents/Loading';
import fetchLive from '../InteractiveLive/FetchLive'
import LoginStore from '../../util/LoginStore'
import LiveClientView from '../InteractiveLive/LiveClientView'

const AnchorIcon = require('../../../img/icon_interactive_anchor.png');
const ColumnIcon = require('../../../img/icon_interactive_column.png');

export default class FocusLiveListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkAll: false,
            count: 0,
            userCodes: '',
            dataSource: [],
            _dataSource: [],
            isRender: false
        };
    }

    getData() {
        fetchLive('getHistoryList', {
            userCode: LoginStore.liveUserCode,
            userId: LoginStore.liveUserId,
            limit:500
        }, (data) => {
            InteractionManager.runAfterInteractions(() => {
                if (data.dataList) {
                    let datas = data.dataList;
                    let today = new moment().format('YYYY-MM-DD');
                    let yesterday = moment().subtract(1, "days").format("YYYY-MM-DD")
                    let dates = [];
                    let handledDatas = [];
                    for (let i = 0; i < datas.length; i++) {
                        let historyDate = new moment(datas[i].historyDate).format('YYYY-MM-DD');
                        if (dates.indexOf(historyDate) == -1) {
                            dates.push(historyDate)
                        }
                    }

                    dates.sort(function (a, b) {
                        return a < b ? 1 : -1;
                    });

                    for (let j = 0; j < dates.length; j++) {
                        console.log(dates[j])
                        let temp = [];
                        for (let i = 0; i < datas.length; i++) {
                            let historyDate = new moment(datas[i].historyDate).format('YYYY-MM-DD');
                            if (historyDate == dates[j]) {
                                temp.push(datas[i].userInfo);
                            }
                        }
                        if (dates[j] == today) {
                            handledDatas.push({key: '今天', data: temp})
                        } else if (dates[j] == yesterday) {
                            handledDatas.push({key: '昨天', data: temp})
                        } else {
                            handledDatas.push({key: dates[j], data: temp})
                        }
                    }

                    this.setState({
                        dataSource: handledDatas,
                        _dataSource: handledDatas,
                        isRender: true
                    });

                }
            })
        })
    }

    componentDidMount() {
        this.getData();
    }

    _sectionHeader = (item) => {
        return (
            <View style={{flexDirection:'row',alignItems:'center',height:30,borderColor:'#ECECEC',borderBottomWidth :1/$.PixelRatio}}>
                <View style={styles.sectionImg} />
                <Text style={styles.sectionKey}>
                    {item.section.key}
                </Text>
            </View>
        )
    }

    _renderRow = (data) => {
        const {navigator}=this.props;
        return (
            <RowData navigator={navigator} item={data.item}/>
        );
    }

    render() {
        const {isRender, dataSource} = this.state;

        return (
            <View style={{flex: 1}}>
                {isRender ?
                    <View style={styles.listView}>
                        <SectionList
                            renderSectionHeader={this._sectionHeader}
                            keyExtractor={(item, index) => index}
                            renderItem={(data) => this._renderRow(data)}
                            sections={dataSource}/>
                    </View>
                    :
                    <Loading/>
                }
            </View>
        )
    }
}

class RowData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            all: false
        };
    }

    onHandle = () => {
        let {navigator,item} = this.props;
        navigator.push({name:LiveClientView,item})
    }

    render() {
        const {item} = this.props;
        return (
            <Touchable style={styles.dataRow} onPress={this.onHandle}>
                <Image style={styles.roomLogo} source={{uri: item.roomInfo.logo}}/>
                <View style={{marginLeft: 10, flex: 1}}>
                    <Text numberOfLines={1} style={{color: 'black'}}>{item.roomInfo.title}</Text>

                    <View style={styles.withIconTextItem}>
                        <Image style={styles.withIcon} source={AnchorIcon}/>
                        <Text numberOfLines={1} style={styles.withText}>{item.nickName}</Text>
                    </View>

                    <View style={styles.withIconTextItem}>
                        <Image style={styles.withIcon} source={ColumnIcon}/>
                        <Text numberOfLines={1} style={styles.withText}>{item.roomInfo.columnInfo.columnName}</Text>
                    </View>
                </View>
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingHorizontal: 5
    },
    listView: {
        flex: 1
    },
    dataRow: {
        height: 97,
        borderBottomWidth: 1 / $.PixelRatio,
        padding: 10,
        borderColor: '#F0F0F0',
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageCheck: {
        width: 21,
        height: 21
    },
    roomLogo: {
        width: 130,
        height: 77
    },
    sectionImg:{
        marginLeft:14,
        backgroundColor:'#019FE8',
        width:4,
        height:4,
        borderRadius:2
    },
    sectionKey:{
        marginLeft:4,
        color:'#9B9B9B',
        fontSize:15
    },
    withIconTextItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    withIcon: {
        width: 12,
        height: 12,
        resizeMode: 'stretch'
    },
    withText:{
        fontSize:12
    }
})