import React, {Component, PureComponent} from 'react';

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
    FlatList,
    Text,
    InteractionManager
} from 'react-native';

import Touchable from '../../compoents/Touchable';
import Loading from '../../compoents/Loading';
import Image from '../../compoents/Image';
import ProgramOrder from '../../util/ProgramOrder';
import LiveContentView from '../Channel/LiveContentView';
import {observable, computed, autorun, untracked} from 'mobx';
import {observer} from 'mobx-react/native';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

@observer
export default class OrderTrueView extends PureComponent {


    @computed get totalCount() {
        return ProgramOrder.orderPrograms.length;
    }

    constructor(props) {
        super(props);
        this.state = {
            checkAll: false,
            count: 0,
            currentCount: 6,
            deleteOrders: '',
            dataSource: [],
            _dataSource: [],
            isRender: false
        };
    }

    getData(count) {
        var dataArray = ProgramOrder.orderPrograms;
        // var dataList = [];
        for (var i = 0; i < dataArray.length && i < count; i++) {
            if (this.state.checkAll) {
                dataArray[i].checked = true;
                dataArray[i].key = i;
            } else if (i < this.state.dataSource.length) {
                dataArray[i].checked = this.state.dataSource[i].checked;
                dataArray[i].key = i;
            } else {
                dataArray[i].checked = false;
                dataArray[i].key = i;
            }
        }

        if (this.state.checkAll) {
            this.setState({
                count: dataArray.length
        })
        }

        this.setState({
            dataSource: dataArray.slice(0, count),
            _dataSource: dataArray.slice(0, count),
            isRender: true
        });
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.disposer = autorun(() => {
                if (this.totalCount >= 0) {
                    untracked(() => this.getData(this.state.currentCount));
                    this.setState({
                        count: 0
                    });
                }
            })
        })
    }

    componentWillUnmount() {
        this.disposer && this.disposer();
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.checkAll != this.state.checkAll) {
            let _dataSource = [...this.state._dataSource];
            var orders = ''
            for (var i = 0; i < _dataSource.length; i++) {
                _dataSource[i].checked = nextState.checkAll;
                orders = orders + _dataSource[i].orderId + ','
            }
            this.setState({
                dataSource: _dataSource,
                _dataSource: _dataSource,
                count: (nextState.checkAll ? _dataSource.length : 0),
                deleteOrders: (nextState.checkAll ? orders : '')
            });
        }
    }

    checkAll = () => {
        this.setState({checkAll: !this.state.checkAll});
    }

    cancel = () => {
        if (this.state.deleteOrders.length > 0) {
            if (this.state.deleteOrders.endsWith(',')) {
                this.state.deleteOrders = this.state.deleteOrders.substring(0, this.state.deleteOrders.length - 1);
                ProgramOrder.deletes(this.state.deleteOrders);
            }
            if(this.state.checkAll){
                this.setState({checkAll:false});
            }
            for(let i=0;i<this.state.dataSource.length;i++){
                this.state.dataSource[i].checked=false;
            }
        }
    }

    check = (rowData) => {
        rowData.checked = !rowData.checked;
        var dataArray = this.state.dataSource;
        var source = '';
        var count = 0;
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].checked) {
                source = source + dataArray[i].orderId + ',';
                count++;
            }
        }
        this.setState({
            count: count,
            deleteOrders: source
        });
    }

    renderRow(item, edit) {
        const {navigator} = this.props;
        return (
            <RowData navigator={navigator} item={item} edit={edit} check={() => this.check(item)}/>
        );
    }

    onEndReached() {
        let currentCount = this.state.currentCount;
        currentCount += 6;
        this.setState({
            currentCount: currentCount
        });
        this.getData(currentCount);
    }

    render() {
        const {isRender, dataSource} = this.state;
        return (
            <View style={{flex: 1}}>
                {isRender ?
                    <View style={styles.listView}>
                        <FlatList
                            removeClippedSubviews={__ANDROID__}
                            style={styles.content}
                            data={dataSource}
                            onEndReached={() => this.onEndReached()}
                            onEndReachedThreshold={0.1}
                            renderItem={({item, edit}) => this.renderRow(item, this.props.edit)}
                        />
                        {this.props.edit ?
                            <View style={styles.edit}>
                                <Text onPress={this.checkAll} style={{
                                    textAlign: 'center',
                                    flex: 10,
                                    color: 'black',
                                    height: 46,
                                    paddingTop: 11
                                }}>{!this.state.checkAll ? '全选' : '取消'}</Text>
                                <Text style={{textAlign: 'center', flex: 1, color: '#ECECEC'}}>|</Text>
                                <Text onPress={this.cancel} style={{
                                    textAlign: 'center',
                                    flex: 10,
                                    color: 'black',
                                    height: 46,
                                    paddingTop: 11
                                }}>取消关注({String(this.state.count)})</Text>
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
        this.state = {};
    }

    check = () => {
        const {item, edit, navigator, check} = this.props;
        if (edit) {
            this.setState({checked: !this.state.checked});
            check(item);
        } else {
            navigator.push({
                name: LiveContentView,
                channel: {
                    channelId: item.channelId,
                    channelName: item.channelName
                }
            })
        }
    }

    format = (value) => {
        var seconds = parseInt((moment(value).toDate() - new Date()) / 1000);
        var hours = ((parseInt(seconds / 3600) + '').length == 1 ? '0' + parseInt(seconds / 3600) : parseInt(seconds / 3600));
        var min = ((parseInt(seconds % 3600 / 60) + '').length == 1 ? '0' + parseInt(seconds % 3600 / 60) : parseInt(seconds % 3600 / 60));
        var second = ((parseInt(seconds % 3600 % 60) + '').length == 1 ? '0' + parseInt(seconds % 3600 % 60) : parseInt(seconds % 3600 % 60));
        return hours + ':' + min + ':' + second;
    }

    render() {
        const {item, edit} = this.props;
        const time = 22;
        return (
            <Touchable style={styles.dataRow} onPress={() => this.check()}>
                <View style={{marginLeft: 5}}>
                    {edit ?
                        (item.checked ?
                                <Image style={styles.imageCheck} source={require('../../../img/icon_check_on.png')}/>
                                :
                                <Image style={styles.imageCheck} source={require('../../../img/icon_check_off.png')}/>
                        )
                        :
                        null
                    }
                </View>
                <Image
                    style={styles.image}
                    source={{uri: global.Base + item.image}}
                    defaultSource={require('../../../img/actor_moren.png')}
                />
                <View style={{marginLeft: 11, marginRight: 5, flex: 1}}>
                    <Text style={{color: 'black', fontSize: 14}}>{item.channelName}</Text>
                    <Text style={{color: 'black', marginTop: 3, fontSize: 14}}>{item.programName}</Text>
                    <Text style={{fontSize: 12, marginTop: 3}}>{item.startTime} 开始</Text>
                </View>
                <View style={{marginRight: 10}}>
                    <Text style={{color: 'green', fontSize: 12}}>直播倒计时</Text>
                    <Text style={{color: 'green', fontSize: 12}}>{this.format(item.startTime)}</Text>
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
        height: 101,
        borderBottomWidth: 1 / $.PixelRatio,
        borderColor: 'grey',
        flexDirection: 'row',
        alignItems: 'center'
    },
    imageCheck: {
        width: 21,
        height: 21
    },
    image: {
        marginLeft: 18,
        width: 63,
        height: 63,
        borderRadius: 32,
    },
    edit: {
        height: 46,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#ECECEC',
        borderWidth: 1 / $.PixelRatio,
    }
})
