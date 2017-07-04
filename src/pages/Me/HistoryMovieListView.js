import React, {Component} from 'react';

import{
    View,
    StyleSheet,
    TextInput,
    ListView,
    TouchableOpacity,
    Button,
    TouchableHighlight,
    Picker,
    ToastAndroid,
    SectionList,
    Text
} from 'react-native';

import Touchable from '../../compoents/Touchable';
import Loading from '../../compoents/Loading';
import Image from '../../compoents/Image';
import fetchData from '../../util/Fetch';
import Store from '../../util/LoginStore';
import VideoContentView from '../../pages/Movie/VideoContentView';
import {observable, action, computed, autorun} from 'mobx';
import {observer} from 'mobx-react/native';
import Toast from 'react-native-root-toast'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export default class HistoryMovieListView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkAll: false,
            count: 0,
            currentCount: 6,
            historyIds: '',
            dataSource: [],
            _dataSource: [],
            isRender: false
        };
    }

    getData() {
        fetchData('GetHistorys', {
            par: {
                startAt: 1,
                maxItems: 100
            }
        }, (data) => {
            if (data.totalResults != '0') {
                let datas = data.historyItem;
                let today = new moment().format('YYYY-MM-DD');
                let yesterday = moment().subtract(1, "days").format("YYYY-MM-DD")
                let dates = [];
                let handledDatas = [];
                for (let i = 0; i < datas.length; i++) {
                    let historyDate = new moment(datas[i].playDateTime).format('YYYY-MM-DD');
                    if (dates.indexOf(historyDate) == -1) {
                        dates.push(historyDate)
                    }
                }

                dates.sort(function (a, b) {
                    return a < b ? 1 : -1;
                });

                for (let j = 0; j < dates.length; j++) {
                    let temp = [];
                    for (let i = 0; i < datas.length; i++) {
                        let historyDate = new moment(datas[i].playDateTime).format('YYYY-MM-DD');
                        if (historyDate == dates[j]) {
                            temp.push(datas[i]);
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
    }

    componentDidMount() {
        this.getData();
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.checkAll != this.state.checkAll) {
            let _dataSource = [...this.state._dataSource];
            var count = 0;
            for (var i = 0; i < _dataSource.length; i++) {
                for (var j = 0; j < _dataSource[i].data.length; j++) {
                    _dataSource[i].data[j].checked = nextState.checkAll;
                    count++;
                }
            }
            this.setState({
                dataSource: _dataSource,
                _dataSource: _dataSource,
                count: (nextState.checkAll ? count : 0)
            });
        }
    }

    checkAll = () => {
        this.setState({checkAll: !this.state.checkAll});
    }

    cancel = () => {
        if (this.state.count > 0) {
            var dataArray = this.state.dataSource
            for (var i = dataArray.length-1; i > -1; i--) {
                for (var j = dataArray[i].data.length-1; j > -1; j--) {
                    if (dataArray[i].data[j].checked) {
                        this.deleteHistory(dataArray[i].data[j].historyId);
                        dataArray[i].data.splice(j,1);
                    }
                }

                if(dataArray[i].data.length<1){
                    dataArray.splice(i,1);
                }
            }

            this.setState({
                dataSource:dataArray,
                count: 0
            });

            Toast.show("删除成功");
        }
    }

    deleteHistory(historyId) {
        fetchData('DeleteHistorys', {
            par: {
                historyId: historyId
            }
        }, (data) => {
        })
    }

    check = (rowData) => {
        if (this.props.edit) {
            rowData.checked = !rowData.checked;
            var source = '';
            let count = this.state.count;
            if (rowData.checked) {
                count++;
            } else {
                count--;
            }
            this.setState({
                count: count,
                historyIds: source
            });
        } else {
            this.props.navigator.push({name: VideoContentView, item: rowData.selectableItem})
        }

    }

    _sectionComp = (item) => {
        return <View style={{flexDirection: 'row',alignItems:'center',height:30, borderColor: '#ECECEC', borderBottomWidth: 1 / $.PixelRatio}}>
            <View style={styles.sectionImg}/>
            <Text style={styles.sectionKey}>
                {item.section.key}
            </Text>
        </View>

    }

    _renderRow = (data, edit) => {
        return (
            <RowData item={data.item} edit={edit} navigator={navigator} check={() => this.check(data.item)}/>
        );
    }

    render() {
        const {isRender, dataSource} = this.state;
        return (
            <View style={{flex: 1}}>
                {isRender ?
                    <View style={styles.listView}>
                        <SectionList
                            renderSectionHeader={this._sectionComp}
                            renderItem={(data) => this._renderRow(data, this.props.edit)}
                            keyExtractor={(item, index) => index}
                            sections={dataSource}/>
                        {this.props.edit ?
                            <View style={styles.edit}>
                                <Text onPress={this.checkAll}
                                      style={styles.footContent}>{!this.state.checkAll ? '全选' : '取消'}</Text>
                                <Text style={{textAlign: 'center', flex: 1, color: '#ECECEC'}}>|</Text>
                                <Text onPress={this.cancel} style={styles.footContent}>删除记录({String(this.state.count)})</Text>
                            </View>
                            : null
                        }
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

    check = () => {
        this.props.check(this.props.item);
    }

    render() {
        const {item, edit} = this.props;
        return (
            <Touchable style={styles.dataRow} onPress={() => this.check()}>
                {edit ?
                    (item.checked ?
                            <Image style={styles.imageCheck} source={require('../../../img/icon_check_on.png')}/>
                            :
                            <Image style={styles.imageCheck} source={require('../../../img/icon_check_off.png')}/>
                    )
                    :
                    null
                }
                <Image
                    style={styles.image}
                    source={{uri: global.Base + (item.selectableItem.imageList.length > 0 ? item.selectableItem.imageList[0].posterUrl : '')}}
                    defaultSource={require('../../../img/banner_moren.png')}
                />
                <View style={styles.contentText}>
                    <Text numberOfLines={1} style={{color: 'black'}}>{item.selectableItem.titleFull}</Text>
                    <Text numberOfLines={1} style={{fontSize: 12}}>{item.selectableItem.actorsDisplay}</Text>
                </View>
            </Touchable>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    listView: {
        flex: 1
    },
    dataRow: {
        height: 98,
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderColor: '#F0F0F0',
        borderBottomWidth: 1 / $.PixelRatio,
    },
    imageCheck: {
        width: 21,
        height: 21,
        marginRight: 10
    },
    image: {
        width: 130,
        height: 77
    },
    edit: {
        height: 46,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ECECEC',
        borderWidth: 1 / $.PixelRatio,
    },
    sectionImg: {
        marginLeft: 14,
        backgroundColor: '#019FE8',
        width: 4,
        height: 4,
        borderRadius: 2
    },
    sectionKey: {
        marginLeft: 4,
        color: '#9B9B9B',
        fontSize: 14
    },
    imgCheck: {
        justifyContent: 'center',
        marginLeft: 12,
        marginRight: 12
    },
    contentText: {
        flex: 1,
        marginLeft: 10
    },
    footContent: {
        textAlign: 'center',
        flex: 10,
        color: 'black',
        height: 46,
        paddingTop: 11
    }
})