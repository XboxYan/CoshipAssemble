import React, {PropTypes, Component} from 'react';

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
    Text
} from 'react-native';

import Touchable from '../../compoents/Touchable.js';
import Loading from '../../compoents/Loading';
import Focus from './FocusView.js';
import Toast from 'react-native-root-toast'
import fetchData from '../../util/Fetch';
import Image from '../../compoents/Image';
import VideoContentView from '../../pages/Movie/VideoContentView';

import {observable, action, computed} from 'mobx';
import {observer} from 'mobx-react/native';


export default class FocusMovieListView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkAll: false,
            count: 0,
            currentCount: 9,
            isRender: false,
            _dataSource: [],
            dataSource: [],
        };
    }

    getData(count) {
        fetchData('GetBookmarks', {
                par: {
                    startAt: count - 8,
                    maxItems: 9
                }
            }, (data) => {
                var dataArray = [];
                dataArray = data.bookmarkedItem;
                let result = this.state._dataSource;
                for (var i = 0; i < dataArray.length; i++) {
                    dataArray[i].key = i + result.length;
                    dataArray[i].checked = false;
                    result.push(dataArray[i]);
                }
                this.setState({
                    dataSource: result,
                    _dataSource: result,
                    isRender: true
                })
            }
        )
    }

    componentDidMount() {
        this.getData(this.state.currentCount);
    }

    loadData = () => {
        let currentCount = this.state.currentCount;
        currentCount += 9;
        this.setState({
            currentCount: currentCount
        });
        this.getData(currentCount);
    }


    checkAll = () => {
        this.setState({checkAll: !this.state.checkAll});
    }

    cancel = () => {
        if (this.state.count > 0) {
            var dataArray = this.state.dataSource;
            var newData = [];
            for (var i = 0; i < dataArray.length; i++) {
                if (dataArray[i].checked) {
                    this.deleteHistory(dataArray[i].selectableItem[0].assetId);
                } else {
                    newData.push(dataArray[i]);
                }
            }
            this.setState({
                dataSource: newData,
                _dataSource: newData,
                count: 0
            });
            Toast.show("删除成功")
        }
    }

    deleteHistory(titleAssetId) {
        fetchData('DeleteBookmark', {
            par: {
                titleAssetId: titleAssetId
            }
        }, (data) => {
        })
    }

    componentWillUpdate(nextProps, nextState) {
        if (nextState.checkAll != this.state.checkAll) {
            let _dataSource = [...this.state._dataSource];
            var ids = '';
            for (var i = 0; i < _dataSource.length; i++) {
                _dataSource[i].checked = nextState.checkAll;
            }
            this.setState({
                dataSource: _dataSource,
                _dataSource: _dataSource,
                count: (nextState.checkAll ? _dataSource.length : 0),
            });
        }
    }

    check = (rowData) => {
        if (this.props.edit) {
            rowData.checked = !rowData.checked;
            var dataArray = this.state.dataSource;
            var source = '';
            var count = 0;
            let count = this.state.count;
            if (rowData.checked) {
                count++;
            } else {
                count--;
            }
            this.setState({
                count: count
            });
        } else {
            this.props.navigator.push({name: VideoContentView, item: rowData.selectableItem[0]})
        }
    }

    renderItem(item, edit) {
        return <RowData item={item} edit={edit} check={() => this.check(item)}/>
    }

    render() {
        const {navigator} = this.props;
        const {dataSource, isRender} = this.state;
        return (
            <View style={{flex: 1}}>
                {
                    isRender ?
                        <View style={{flex: 1}}>
                            <FlatList
                                removeClippedSubviews={__ANDROID__}
                                style={styles.content}
                                numColumns={3}
                                data={dataSource}
                                onEndReached={() => this.loadData()}
                                onEndReachedThreshold={10}
                                renderItem={({item, edit}) => this.renderItem(item, this.props.edit)}
                            />
                            {this.props.edit ?
                                <View style={styles.edit}>
                                    <Text onPress={this.checkAll}
                                          style={styles.footTitle}>{!this.state.checkAll ? '全选' : '取消'}</Text>
                                    <Text style={{textAlign: 'center', flex: 1, color: '#ECECEC'}}>|</Text>
                                    <Text onPress={this.cancel} style={styles.footTitle}>取消收藏({String(this.state.count)})</Text>
                                </View>
                                : null
                            }
                        </View>
                        : <Loading/>
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
        this.setState({checked: !this.state.checked});
        this.props.check(this.props.item);
    }

    render() {
        const {item, edit} = this.props;
        return (
            <Touchable style={styles.movieitem} onPress={() => this.check()}>
                <Image
                    style={styles.movietimg}
                    source={{uri: global.Base + (item.selectableItem[0].imageList.length > 0 ? item.selectableItem[0].imageList[0].posterUrl : '')}}
                    defaultSource={require('../../../img/poster_moren.png')}
                />
                <View style={styles.movietext}>
                    {edit ?
                        (/*this.state.checked*/item.checked ?
                                <Image style={styles.imageCheck} source={require('../../../img/icon_check_on.png')}/>
                                :
                                <Image style={styles.imageCheck} source={require('../../../img/icon_check_off.png')}/>
                        )
                        :
                        null
                    }
                    <Text numberOfLines={1} style={styles.moviename}>{item.selectableItem[0].titleFull}</Text>
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
    movieitem: {
        width: ($.WIDTH - 28) / 3,
        height: ($.WIDTH - 28) / 2 + 40,
        marginHorizontal: 3
    },
    movietimg: {
        width: '100%',
        flex: 1,
        resizeMode: 'cover'
    },
    movietext: {
        alignItems: 'center',
        height: 40,
        flexDirection: 'row'
    },
    moviename: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        flex: 1
    },
    imageCheck: {
        width: 21,
        height: 21
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
    footTitle: {
        textAlign: 'center',
        flex: 10,
        color: 'black',
        height: 46,
        paddingTop: 11
    }
});