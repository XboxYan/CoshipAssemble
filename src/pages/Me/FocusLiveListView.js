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
    Picker,
    ToastAndroid,
    FlatList,
    Text
} from 'react-native';

import Touchable from '../../compoents/Touchable';
import Loading from '../../compoents/Loading';
import LoginStore from '../../util/LoginStore'
import fetchLive from '../InteractiveLive/FetchLive'
import LiveClientView from '../InteractiveLive/LiveClientView'
import Toast from 'react-native-root-toast'

const AnchorIcon = require('../../../img/icon_interactive_anchor.png');
const ColumnIcon = require('../../../img/icon_interactive_column.png');

export default class FocusLiveListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkAll: false,
            count: 0,
            userCodes: '',
            _dataSource: [],
            dataSource: [],
            isRender: false
        };
    }

    getData() {
        fetchLive('getFocusList', {
                userCode: LoginStore.liveUserCode,
                userId: LoginStore.liveUserId,
                focusType: 1,
                status: 3
            }, (data) => {
                var dataArray = data.dataList;
                for (var i = 0; i < dataArray.length; i++) {
                    dataArray[i].checked = false;
                    dataArray[i].key = i;
                }
                this.setState({
                    dataSource: dataArray,
                    _dataSource: dataArray,
                    isRender: true
                });
            }
        )
    }

    componentDidMount() {
        this.getData();
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.checkAll != this.state.checkAll) {
            let _dataSource = [...this.state._dataSource];
            var userCode = ''
            for (var i = 0; i < _dataSource.length; i++) {
                _dataSource[i].checked = nextState.checkAll;
                userCode = userCode + _dataSource[i].userInfo.userCode + ','
            }
            this.setState({
                dataSource: _dataSource,
                _dataSource: _dataSource,
                count: (nextState.checkAll ? _dataSource.length : 0),
                userCodes: (nextState.checkAll ? userCode : '')
            });
        }
    }

    checkAll = () => {
        this.setState({checkAll: !this.state.checkAll});
    }

    cancel = () => {
        if (this.state.count > 0) {

            var dataArray = this.state.dataSource
            var newData = [];
            for (var i = 0; i < dataArray.length; i++) {
                if (dataArray[i].checked) {
                    this.deleteFocus(dataArray[i].userInfo.userCode);
                } else {
                    newData.push(dataArray[i])
                }
            }

            this.setState({
                dataSource: newData,
                _dataSource: newData,
                count: 0
            });
            Toast.show("取消关注成功");
        }
    }

    deleteFocus(focusUserCode) {
        fetchLive('deleteFocus', {
                userCode: LoginStore.liveUserCode,
                userId: LoginStore.liveUserId,
                focusUserCode: focusUserCode
            }, (data) => {
                console.log('Interactive focus delete success')
            }
        )
    }

    check = (rowData) => {
        rowData.checked = !rowData.checked;
        var dataArray = this.state.dataSource;
        var source = '';
        var count = 0;
        for (var i = 0; i < dataArray.length; i++) {
            if (dataArray[i].checked) {
                source = source + dataArray[i].userInfo.userCode + ',';
                count++;
            }
        }
        this.setState({
            count: count,
            userCodes: source
        });
    }

    renderRow(item, edit) {
        const {navigator} = this.props;
        return (
            <RowData navigator={navigator} item={item} edit={edit} check={() => this.check(item)}/>
        );
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
                            onEndReached={/*()=>this.loadData()*/(info) => {
                                console.log(info.distanceFromEnd)
                            }}
                            onEndReachedThreshold={10}
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
        this.state = {
            all: false
        };
    }

    check = () => {
        if (this.props.edit) {
            this.setState({checked: !this.state.checked});
            this.props.check(this.props.item);
        } else {
            let {navigator, item} = this.props;
            const {userInfo} = item;
            item = userInfo;
            navigator.push({name: LiveClientView, item})
        }
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

                <Image style={styles.roomLogo} source={{uri: item.userInfo.roomInfo.logo}}/>
                <View style={{marginLeft: 10, flex: 1}}>
                    <Text numberOfLines={1} style={{color: 'black'}}>{item.userInfo.roomInfo.title}</Text>

                    <View style={styles.withIconTextItem}>
                        <Image style={styles.withIcon} source={AnchorIcon}/>
                        <Text numberOfLines={1} style={styles.withText}>{item.userInfo.nickName}</Text>
                    </View>

                    <View style={styles.withIconTextItem}>
                        <Image style={styles.withIcon} source={ColumnIcon}/>
                        <Text numberOfLines={1}
                              style={styles.withText}>{item.userInfo.roomInfo.columnInfo.columnName}</Text>
                    </View>
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
        height: 97,
        borderBottomWidth: 1 / $.PixelRatio,
        padding: 10,
        borderColor: '#F0F0F0',
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageCheck: {
        width: 21,
        height: 21,
        marginRight: 10
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
    roomLogo: {
        width: 130,
        height: 77
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
    withText: {
        fontSize: 12
    }
})