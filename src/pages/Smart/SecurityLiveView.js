import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    Image,
    ScrollView,
    AppState,
    FlatList,
    UIManager,
    LayoutAnimation,
    InteractionManager,
    BackAndroid,
    View,
    ToastAndroid,
} from 'react-native';

import Loading from '../../compoents/Loading'
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
import Picker from 'react-native-picker';
import Toast from 'react-native-root-toast'
import Video from '../../compoents/Video';
import Touchable from '../../compoents/Touchable';

import {observable, action, computed} from 'mobx';
import {observer} from 'mobx-react/native';
import AlarmView from './AlarmView'

import FetchSecurity from '../../util/FetchSecurity'

//function image
const Trumpet = require('../../../img/icon_security_trumpet.png');
const Annunciator = require('../../../img/icon_security_annunciator.png');
const Review = require('../../../img/icon_security_review.png');
const Device = require('../../../img/icon_security_device.png');

//shoutLayer image
const MicroPhone = require('../../../img/icon_security_microphone.png');
const Sonic = require('../../../img/icon_security_sonic.png');

//alarmLayer image
const Fire = require('../../../img/icon_security_fire.png');
const Hurt = require('../../../img/icon_security_hurt.png');
const Steal = require('../../../img/icon_security_steal.png');
const Other = require('../../../img/icon_security_other.png');
const Cancel = require('../../../img/icon_security_cancel.png');

const alarmType_Fire = "119"
const alarmType_Robbery = "110";
const alarmType_Hurt = "120";
const alarmType_Other = "999"


//deviceLayer image
const MonitoringArrow = require('../../../img/icon_security_monitorArrow.png');
const PlayArrow = require('../../../img/icon_security_playArrow.png');

//place image
const placeImage = require('../../../img/icon_security_temp_placeImage.jpg');

//fullscreen device list item
class FullScreenDeviceListItem extends PureComponent {
    render() {
        <View style={{width: 266, height: 87, backgroundColor: 'black', flexDirection: 'row'}}>
            <Image style={{width: 101, height: 63}} source={placeImage}></Image>
            <View style={{flex: 1}}>
                <Text style={{fontSize: 14, color: 'white'}}>东门路口一</Text>
                <Text style={{fontSize: 14, color: 'white'}}>正在播放</Text>
            </View>
        </View>
    }
}

let lastDeviceId = '';

class DataStore {

    @observable
    deviceId = '123';

    @observable
    deviceName='';

    @observable
    startDateTime = '';

    endDateTime = '';

    @computed
    get DeviceStore() {
        return new DeviceStore(this)
    }

    @computed
    get MonitorVideoStore() {
        return new MonitorVideoStore(this.deviceId, this.startDateTime, this.endDateTime);
    }

}

class DeviceStore {
    Store = null;

    @observable
    deviceList = [];

    @observable
    isRender = false;

    @observable
    selectedIndex = 1;

    @computed
    get selectedItem() {
        return this.length ? this.data[this.selectedIndex - 1] : null;
    }

    constructor(store) {
        this.Store = store;
        this._fetchData();
    }

    _fetchData = () => {
        FetchSecurity('GetContents', {
            par: {}
        }, (data) => {

            let i = 1;
            if (data.frontEndDevice) {
                data.frontEndDevice.map((item) => {
                        let tempItem = {
                            index: i,
                            deviceId: item.deviceId,
                            deviceState: item.deviceState,
                            deviceName: item.deviceName,
                            deviceType: item.deviceType,
                            isSupportBTV: item.isSupportBTV,
                            bitrate: item.bitrate
                        };
                        let tempDeviceItemStore = new DeviceItemStore(tempItem, this)
                        this.deviceList.push(tempDeviceItemStore);
                        i++;
                    }
                )
                this.Store.deviceId = this.deviceList[0].deviceId;
                this.Store.deviceName=this.deviceList[0].deviceName;
                this.isRender = true;
            }
        });
    }

    @computed
    get length() {
        return this.deviceList.length;
    }
}

class DeviceItemStore {
    deviceId = '';
    deviceName: '';
    deviceState: '';
    deviceType: '';
    isSupportBTV: '';
    bitrate = '';
    index = '';
    list = null;

    constructor(Item, list) {
        const {bitrate, index, deviceId, deviceName, deviceState, deviceType, isSupportBTV} = Item;
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.deviceState = deviceState;
        this.deviceType = deviceType;
        this.isSupportBTV = isSupportBTV;
        this.bitrate = bitrate;
        this.index = index;
        this.list = list;
    }

    @computed
    get selected() {
        return this.list.selectedIndex === this.index;
    }

    @computed
    get isOnline() {
        return this.deviceState == "1";
    }

    @action
    select = () => {
        this.list.selectedIndex = this.index;
        this.list.Store.deviceId = this.deviceId;
    }
}

class MonitorVideoStore {
    @observable
    playUri = '';

    @observable
    isRender = false;

    @observable
    monitorState=''

    constructor(deviceId, startDateTime, endDateTime) {
        this._fetchData(deviceId, startDateTime, endDateTime);
    }

    _fetchData = (deviceId, startDateTime, endDateTime) => {
        if (deviceId != lastDeviceId) {

            lastDeviceId = deviceId;
            this.monitorState="实时";
            FetchSecurity('HTTPLive', {
                par: {
                    deviceId: deviceId
                }
            }, (data) => {
                this.isRender = true;
                this.playUri = data.http;
            })
        } else {
            this.monitorState="回看"
            FetchSecurity('HTTPPlayback', {
                par: {
                    deviceId: deviceId,
                    startDateTime: startDateTime,
                    endDateTime: endDateTime
                }
            }, (data) => {
                if (data.message) {
                    Toast.show(data.message);
                } else {
                    if (data.http) {
                        //alert(data.http)
                        this.playUri = data.http;
                        this.isRender = true;
                    }
                }
            })
        }


    }
}

//fullscreen device list
class FullScreenDeviceList extends PureComponent {
    data = [
        {key: 'a'},
        {key: 'b'},
        {key: 'c'},
        {key: 'd'},
    ]
    renderItem = (item, index) => {
        const {navigator} = this.props;
        return <FullScreenDeviceListItem navigator={navigator}/>
    }

    render() {
        return (
            <FlatList
                removeClippedSubviews={__ANDROID__}
                style={styles.placeList}
                horizontal={true}
                data={this.data}
                renderItem={this.renderItem}
                getItemLayout={(data, index) => ( {length: 113, offset: 113 * index, index} )}
            />
        )
    }
}

class FunctionItem extends PureComponent {
    render() {
        const {handleClick, functionName, functionImg} = this.props;
        return (
            <Touchable style={styles.functionItem} onPress={handleClick}>

                <Image style={styles.functionImg} source={functionImg}/>

                <Text numberOfLines={1} style={styles.functionText}>{functionName}</Text>

            </Touchable>
        );
    }
}

class PlaceItem extends PureComponent {
    render() {
        const {time, imgUrl} = this.props;
        return (
            <Touchable style={styles.placeItem}>
                <Image source={placeImage} style={styles.placeImg}></Image>
                <Text style={styles.monitorTimeUnselected}>12:00</Text>
            </Touchable>
        );
    }
}

class PlaceList extends PureComponent {

    data = [
        {key: 'a'},
        {key: 'b'},
        {key: 'c'},
        {key: 'd'},
    ]

    renderItem = (item, index) => {
        const {navigator} = this.props;
        return <PlaceItem navigator={navigator}/>
    }

    render() {
        const {date, time, imgUrl} = this.props;
        return (
            <FlatList
                removeClippedSubviews={__ANDROID__}
                style={styles.placeList}
                horizontal={true}
                data={this.data}
                showsHorizontalScrollIndicator={false}
                renderItem={this.renderItem}
                getItemLayout={(data, index) => ( {length: 113, offset: 113 * index, index} )}
            />
        )
    }
}

class SectionItem extends PureComponent {
    render() {
        return (
            <View style={styles.sectionItem}>
                <View style={styles.dateContainer}>
                    <Text style={{marginLeft: 10, fontSize: 16}}>4月26日</Text>
                </View>
                <View style={{height: 1, backgroundColor: '#F0F0F0'}}></View>
                <View style={styles.placeListContainer}>
                    <PlaceList/>
                </View>
            </View>
        )
    }
}

class SectionList extends PureComponent {
    separator = () => {
        return <View style={{height: 4}}/>;
    }

    data = [
        {key: 'a'},
        {key: 'b'},
        {key: 'c'},
    ]

    renderItem = (item, index) => {
        return <SectionItem/>
    }

    render() {
        return (

            <FlatList
                removeClippedSubviews={__ANDROID__}
                style={{marginTop: 12}}
                data={this.data}
                renderItem={this.renderItem}
                getItemLayout={(data, index) => ( {length: 156, offset: 156 * index, index} )}
                ItemSeparatorComponent={this.separator}
                showsVerticalScrollIndicator={false}
            />

        )
    }
}

class ShoutLayer extends PureComponent {
    render() {
        const {isRender, changeIsRender} = this.props;

        return (
            isRender ?
                <View style={styles.layerContainer}>
                    <Touchable style={styles.layerMask} onPress={changeIsRender}/>
                    <View style={styles.shoutLayer}>
                        <Text style={styles.shoutLayerTip}>按住麦克风喊话</Text>
                        <Touchable style={styles.shoutLayerImgContainer}>
                            <Image style={styles.shoutLayerImg} source={MicroPhone}></Image>
                        </Touchable>
                        <Touchable style={styles.shoutLayerCancel} onPress={changeIsRender}>
                            <Text style={{fontSize: 14, color: '#333333'}}>取消</Text>
                        </Touchable>
                    </View>
                </View>
                :
                null
        )
    }
}

class AlarmLayerItem extends PureComponent {
    onHandle = () => {
        const {navigator, alarmType, deviceId} = this.props;
        navigator.push({
            name: AlarmView,
            alarmType: alarmType,
            deviceId: deviceId
        })
    }

    render() {
        const {alarmImage, alarmName, style} = this.props
        return (
            <View style={[styles.alarmItem, style]}>
                <Touchable style={styles.alarmImageContainer} onPress={this.onHandle}>
                    <Image source={alarmImage} style={styles.alarmImage}></Image>
                </Touchable>
                <Text style={styles.alarmName}>{alarmName}</Text>
            </View>
        )
    }
}

class AlarmLayer extends PureComponent {
    render() {
        const {isRender, navigator, changeIsRender, DataStore} = this.props;
        return (
            isRender ?
                <View style={styles.layerContainer}>
                    <Touchable style={styles.layerMask} onPress={changeIsRender}/>
                    <View style={styles.alarmLayer}>
                        <View style={styles.alarmRow}>
                            <AlarmLayerItem alarmType={alarmType_Fire} deviceId={DataStore.deviceId}
                                            navigator={navigator} alarmImage={Fire} style={{marginRight: 50}}
                                            alarmName="火灾"/>
                            <AlarmLayerItem alarmType={alarmType_Robbery} deviceId={DataStore.deviceId}
                                            navigator={navigator} alarmImage={Steal} style={{marginLeft: 50}}
                                            alarmName="盗抢"/>
                        </View>
                        <View style={styles.alarmRow}>
                            <AlarmLayerItem alarmType={alarmType_Hurt} deviceId={DataStore.deviceId}
                                            navigator={navigator} alarmImage={Hurt} style={{marginRight: 50}}
                                            alarmName="伤害"/>
                            <AlarmLayerItem alarmType={alarmType_Other} deviceId={DataStore.deviceId}
                                            navigator={navigator} alarmImage={Other} style={{marginLeft: 50}}
                                            alarmName="其他"/>
                        </View>
                        <Touchable style={styles.alarmLayerCancelContainer} onPress={changeIsRender}>
                            <Image style={styles.alarmLayerCancel} source={Cancel}/>
                        </Touchable>
                    </View>
                </View>
                :
                null
        )
    }
}

function createDateData() {
    let date = {};
    for (let i = 1950; i < 2050; i++) {
        let month = {};
        for (let j = 1; j < 13; j++) {
            let day = [];
            if (j === 2) {
                for (let k = 1; k < 29; k++) {
                    day.push(k + '日');
                }
            }
            else if (j in {1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1}) {
                for (let k = 1; k < 32; k++) {
                    day.push(k + '日');
                }
            }
            else {
                for (let k = 1; k < 31; k++) {
                    day.push(k + '日');
                }
            }
            month[j + '月'] = day;
        }
        date[i + '年'] = month;
    }
    return date;
};

function createDate() {
    let date = {};
    for (let i = 1993; i < 2017; i++) {
        let month = {};
        for (let j = 1; j < 13; j++) {
            let day = [];
            if (j === 2) {
                for (let k = 1; k < 29; k++) {
                    day.push(k + '日');
                }
            }
            else if (j in {1: 1, 3: 1, 5: 1, 7: 1, 8: 1, 10: 1, 12: 1}) {
                for (let k = 1; k < 32; k++) {
                    day.push(k + '日');
                }
            }
            else {
                for (let k = 1; k < 31; k++) {
                    day.push(k + '日');
                }
            }
            month[j + '月'] = day;
        }
        date[i + '年'] = month;
    }
    return date;
};

class ReviewLayer extends PureComponent {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const {isRender, changeIsRender} = this.props;
        return (
            isRender ?
                <View style={styles.layerContainer}>
                    <Touchable style={styles.layerMask} onPress={changeIsRender}/>

                </View>
                :
                null
        )
    }
}

@observer
class DeviceItem extends PureComponent {
    _handleClick = (item) => {
        if (item.isOnline) {
            item.select()
        } else {
            Toast.show("当前设备离线")
        }
    }

    render() {
        const {index, item} = this.props;
        return (
            <Touchable onPress={() => this._handleClick(item)} style={styles.deviceItem}>
                <View style={{justifyContent: 'center', alignItems: 'center', width: 55, height: 56}}>
                    <Text style={[styles.deviceItemNumber, item.selected && styles.deviceTextActive]}>{index}</Text>
                </View>
                <View style={styles.deviceItemIntro}>
                    <Text
                        style={[styles.deviceItemName, item.selected && styles.deviceTextActive]}>{item.deviceName}</Text>
                    <Text
                        style={[styles.deviceItemState, item.selected && styles.deviceTextActive]}>{item.isOnline ? (item.selected ? '正在播放' : '正在监控') : '设备离线'}</Text>
                </View>
                <Image style={{width: 21, height: 21, resizeMode: 'stretch', marginRight: 15}}
                       source={item.selected ? PlayArrow : MonitoringArrow}></Image>
            </Touchable>

        )
    }
}

@observer
class DeviceLayer extends PureComponent {

    renderItem = (item) => {
        return (<DeviceItem key={item.index} index={item.index + 1} item={item.item}/>)
    }

    render() {
        const {isRender, changeIsRender, DataStore} = this.props;

        const deviceList = DataStore.DeviceStore.deviceList;
        const dataLoaded = DataStore.DeviceStore.isRender;
        return (
            isRender ?
                (
                    <View style={styles.layerContainer}>
                        <Touchable style={styles.layerMask} onPress={changeIsRender}/>
                        <View style={styles.deviceLayer}>
                            <View style={styles.deviceTitleContainer}>
                                <Text style={styles.deviceListTitle}>监控设备列表</Text>
                                <Touchable style={styles.deviceListCloseContainer} onPress={changeIsRender}>
                                    <Text style={styles.deviceListClose}>关闭</Text>
                                </Touchable>
                            </View>
                            <View style={{height: 1, backgroundColor: '#F0F0F0'}}></View>
                            {
                                dataLoaded ?
                                    <FlatList
                                        removeClippedSubviews={__ANDROID__}
                                        data={deviceList}
                                        keyExtractor={(item, index) => item.deviceId}
                                        renderItem={this.renderItem}
                                        getItemLayout={(data, index) => ( {length: 56, offset: 56 * index, index} )}
                                    />
                                    :
                                    <Loading/>
                            }
                        </View>
                    </View>

                )
                :
                null
        )
    }
}

@observer
export default class SecurityLiveView extends PureComponent {
    DataStore = new DataStore();

    constructor(props) {
        super(props);
        this.state = {
            isRender: false,
            shoutLayerRender: false,
            alarmLayerRender: false,
            deviceLayerRender: false,
            reviewLayerRender: false,
            layoutTop: 100
        }
        const {navigator} = this.props;
        const routers = navigator.getCurrentRoutes();
        const top = routers[routers.length - 1];
        top.handleBack = this.handleBack;
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }


    handleBack = () => {
        if (this.video && this.video.isFull) {
            this.video.setFullScreen();
        } else {
            const {navigator} = this.props;
            const routers = navigator.getCurrentRoutes();
            if (routers.length > 1) {
                navigator.pop();
            } else {
                this.video && this.video.onPause();
                this.props.navigator.pop();
            }
        }
    }

    componentWillUnmount() {
        Picker.hide();
    }

    @action
    callPlayBack(data) {
        let dateAndTime = data.toString().split(",");
        let monthAndDay = dateAndTime[0];
        let hourAndMin = dateAndTime[1];
        let month = monthAndDay.split("-")[0];
        let day = monthAndDay.split("-")[1];
        let year = moment().format("YYYY");
        let hour = hourAndMin.split(":")[0];
        let endHour = Number(hour) + 1;
        if (endHour < 10) {
            endHour = '0' + endHour
        };

        if(endHour==24){
            moment(data)
            endHour='00';
        }

        let startDateTime = year + month + day + hour + "0000";
        let endDateTime=''
        if(endHour=='00'){
            endDateTime=moment(year+month+day,'YYYYMMDD').add(1,'days').format('YYYYMMDD')+endHour+"0000";
        }else{
            endDateTime = year + month + day + endHour + "0000";
        }

        this.DataStore.endDateTime = endDateTime;
        this.DataStore.startDateTime = startDateTime;
    }

    onBackAndroid=()=>{
        if(this.state.shoutLayerRender){
            this.changeShoutLayerRender()
            return true;
        }
        if(this.state.alarmLayerRender){
            this.changeAlarmLayerRender();
            return true;
        }
        if(this.state.reviewLayerRender){
            this.changeReviewLayerRender();
            return true;
        }
        if(this.state.deviceLayerRender){
            this.changeDeviceLayerRender();
            return true;
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isRender: true,
                playUri: 'http://bofang.bati.cc/rr/HongMaoLanTuHuoFengHuang_hd.m3u8'
                //http://10.9.216.1:8040/live?device_id=123123&bitrate=3750 武研可播放
                //playUri:'http://gslb.hrtn.net:8080/live/coship,TWSX1421638319994522.m3u8?fmt=x264_0k_mpegts&sora=1&sk=C90839043C325195586FA305460BE05E&uuid=bab357c2-1be7-40cf-9883-67d9547a8f6f&userCode=hrb002&userName=hrb002&spCode=484581254562&productCode=dpacdb100&resourceCode=102400201&subId=99999999&resourceName=&authType=2'
            });

            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);

            let datas = [];
            let today = moment().format('MM-DD');
            let currentHour = moment().format('HH');
            let hours = [];
            for (let m = 0; m <= currentHour; m++) {
                if (m < 10) {
                    hours.push('0' + m + ':00');
                } else {
                    hours.push(m + ':00');
                }
            }

            let tempObj = {}
            tempObj[today] = hours;
            datas.push(tempObj)

            for (let i = 1; i <= 7; i++) {
                let tempDate = moment().subtract(i, 'days').format('MM-DD');
                let tempHours = [];
                for (let j = 0; j < 24; j++) {
                    if (j < 10) {
                        tempHours.push('0' + j + ':00');
                    } else {
                        tempHours.push(j + ':00');
                    }
                }
                let obj = {};
                obj[tempDate] = tempHours;
                datas.push(obj);
            }

            let selectedItem = [];
            selectedItem.push(today + "");
            if (currentHour < 10) {
                selectedItem.push('0' + currentHour + ':00')
            } else {
                selectedItem.push(currentHour + ':00')
            }

            Picker.init({
                pickerData: datas,
                selectedValue: selectedItem,
                pickerToolBarBg: [255, 255, 255, 1],
                pickerBg: [255, 255, 255, 1],
                pickerConfirmBtnText: '确认',
                pickerCancelBtnText: '取消',
                pickerTitleText: '选择回看时间',
                onPickerConfirm: data => {

                    this.callPlayBack(data);
                    this.setState({reviewLayerRender: !this.state.reviewLayerRender});
                },
                onPickerCancel: data => {
                    this.setState({reviewLayerRender: !this.state.reviewLayerRender});
                },
                onPickerSelect: data => {
                    console.log(data);
                }
            });
        })

    }

    onLayout = (e) => {
        let {y} = e.nativeEvent.layout;
        this.setState({
            layoutTop: y + $.STATUS_HEIGHT
        })
    }

    changeShoutLayerRender = () => {
        this.setState({shoutLayerRender: !this.state.shoutLayerRender});
    }

    changeAlarmLayerRender = () => {
        this.setState({alarmLayerRender: !this.state.alarmLayerRender});
    }

    changeDeviceLayerRender = () => {
        this.setState({deviceLayerRender: !this.state.deviceLayerRender});
    }

    changeReviewLayerRender = () => {
        this.setState({reviewLayerRender: !this.state.reviewLayerRender});
        Picker.toggle();
    }

    render() {
        const {navigator, route} = this.props;
        const {isRender, layoutTop} = this.state;
        const MonitorVideoStore = this.DataStore.MonitorVideoStore;
        return (
            <View style={styles.content}>
                <View style={{flex: 1}}>
                    <StatusBar barStyle='light-content'
                               backgroundColor='transparent'/>
                    <View onLayout={this.onLayout} style={styles.videoCon}></View>
                    {
                        isRender &&
                        <Video
                            ref={(ref) => {
                                this.video = ref
                            }}
                            handleBack={this.handleBack}
                            actionBar={this.renderActionBar}
                            playUri={MonitorVideoStore.playUri}
                            title={this.DataStore.deviceName}
                            monitorState={MonitorVideoStore.monitorState}
                            style={{top: layoutTop}}/>
                    }
                    <View style={styles.functionContainer}>
                        <FunctionItem functionName="喊话" handleClick={() => {
                            this.changeShoutLayerRender()
                        }} functionImg={Trumpet}/>
                        <FunctionItem functionName="报警" handleClick={() => {
                            this.changeAlarmLayerRender()
                        }} functionImg={Annunciator}/>
                        <FunctionItem functionName="回看" handleClick={() => {
                            this.changeReviewLayerRender()
                        }} functionImg={Review}/>
                        <FunctionItem functionName="设备" handleClick={() => {
                            this.changeDeviceLayerRender()
                        }} functionImg={Device}/>
                    </View>

                    <SectionList/>
                </View>
                <ShoutLayer isRender={this.state.shoutLayerRender} changeIsRender={this.changeShoutLayerRender}/>
                <AlarmLayer isRender={this.state.alarmLayerRender} changeIsRender={this.changeAlarmLayerRender}
                            navigator={navigator} DataStore={this.DataStore}/>
                <ReviewLayer isRender={this.state.reviewLayerRender} changeIsRender={this.changeReviewLayerRender}/>
                <DeviceLayer isRender={this.state.deviceLayerRender} changeIsRender={this.changeDeviceLayerRender}
                             DataStore={this.DataStore}/>
            </View>

        )
    }

}

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#F0F0F0',
        position: 'relative',
        flex: 1
    },
    videoCon: {
        height: $.WIDTH * 9 / 16 + $.STATUS_HEIGHT,
        paddingTop: $.STATUS_HEIGHT,
        backgroundColor: '#000'
    },
    functionContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 60,
        backgroundColor: 'white'
    },
    functionItem: {
        height: 60,
        width: $.WIDTH / 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    functionImg: {
        width: 20,
        height: 20,
        resizeMode: 'stretch'
    },
    functionText: {
        fontSize: 15,
        color: 'black',
        marginTop: 3
    },
    placeItem: {
        width: 108,
        height: 90,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginRight: 5
    },
    placeImg: {
        width: 108,
        height: 67,
    },
    monitorTimeUnselected: {
        fontSize: 12,
        color: '#333333',
        marginTop: 6
    },
    monitorTimeSelected: {
        fontSize: 12,
        color: '#0099ff',
        marginTop: 6
    },
    placeList: {
        marginTop: 10,
        marginLeft: 10,
        marginBottom: 10,
        backgroundColor: 'white'
    },
    sectionItem: {
        width: $.WIDTH,
        height: 152,
        backgroundColor: 'white'

    },
    dateContainer: {
        width: $.WIDTH,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    placeListContainer: {
        width: $.WIDTH,
        height: 108
    },
    layerContainer: {
        width: $.WIDTH,
        height: $.HEIGHT,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex:1000
    },
    layerMask: {
        width: $.WIDTH,
        height: $.HEIGHT,
        backgroundColor: '#000',
        opacity: 0.6
    },
    shoutLayer: {
        width: $.WIDTH,
        height: 258,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white'
    },
    shoutLayerTip: {
        color: '#333333',
        fontSize: 14,
        marginTop: 17
    },
    shoutLayerImgContainer: {
        width: 124,
        height: 124,
        marginTop: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    shoutLayerImg: {
        width: 70,
        height: 70
    },
    shoutLayerCancel: {
        width: $.WIDTH,
        marginTop: 25,
        borderTopWidth: 1,
        borderColor: '#f0f0f1',
        height: 53,
        justifyContent: 'center',
        alignItems: 'center'
    },
    alarmLayer: {
        width: $.WIDTH,
        height: 282,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: 'white'
    },
    alarmLayerCancelContainer: {
        width: 33,
        height: 33,
        marginTop: 24,
        marginBottom: 10

    },
    alarmLayerCancel: {
        width: 33,
        height: 33,
        resizeMode: 'stretch'
    },
    alarmLayerCancel: {
        width: 33,
        height: 33
    },
    alarmItem: {
        height: 83,
        width: 61,
        justifyContent: 'center',
        alignItems: 'center'
    },
    alarmImageContainer: {
        width: 61,
        height: 61,
    },
    alarmImage: {
        width: 61,
        height: 61,
        resizeMode: 'stretch'
    },
    alarmName: {
        fontSize: 12,
        color: '#333333'
    },
    alarmRow: {
        flexDirection: 'row',
        width: $.WIDTH,
        height: 83,
        marginTop: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    deviceLayer: {
        width: $.WIDTH,
        height: 290,
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: '#fff'
    },
    deviceItem: {
        flexDirection: 'row',
        width: $.WIDTH,
        height: 56,
        alignItems: 'center'
    },
    deviceItemNumber: {

        color: '#333333',

        fontSize: 14
    },
    deviceItemIntro: {
        height: 56,
        justifyContent: 'center',
        flex: 1,
    },
    deviceItemName: {
        fontSize: 12,
        color: '#666666'
    },
    deviceItemState: {
        fontSize: 10,
        color: '#333333'
    },
    deviceTextActive: {
        color: '#4aa3fe'
    },
    deviceTitleContainer: {
        width: $.WIDTH,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center'

    },
    deviceListTitle: {
        flex: 1,
        marginLeft: 16,
        fontSize: 16,
        color: '#333333'
    },
    deviceListClose: {
        fontSize: 14,
        color: '#666666'
    },
    deviceListCloseContainer: {
        height:44,
        width:60,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reviewLayer: {
        width: $.WIDTH,
        height: 0.25 * $.HEIGHT,
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor: '#fff'
    },
    reviewLayerButtonContainer: {
        height: 53,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0
    },
    reviewLayerButton: {
        width: 180,
        justifyContent: 'center',
        alignItems: 'center'

    },
    reviewLayerButtonText: {
        fontSize: 14,
        color: '#019fe8'
    }

})
