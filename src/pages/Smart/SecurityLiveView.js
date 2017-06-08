import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    Image,
    ScrollView,
    FlatList,
    UIManager,
    LayoutAnimation,
    InteractionManager,
    View,
} from 'react-native';

import Picker from 'react-native-picker';

import Video from '../../compoents/Video';
import Touchable from '../../compoents/Touchable';

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


//deviceLayer image
const MonitoringArrow = require('../../../img/icon_security_monitorArrow.png');
const PlayArrow = require('../../../img/icon_security_playArrow.png');

//place image
const placeImage = require('../../../img/icon_security_temp_placeImage.jpg');

//fullscreen device list item
class FullScreenDeviceListItem extends PureComponent{
    render(){
        <View style={{width:266,height:87,backgroundColor:'black',flexDirection:'row'}}>
            <Image style={{width:101,height:63}} source={placeImage}></Image>
            <View style={{flex:1}}>
                <Text style={{fontSize:14,color:'white'}}>东门路口一</Text>
                <Text style={{fontSize:14,color:'white'}}>正在播放</Text>
            </View>
        </View>
    }
}
//fullscreen device list
class FullScreenDeviceList extends PureComponent{
    data = [
        {key: 'a'},
        {key: 'b'},
        {key: 'c'},
        {key: 'd'},
        {key: 'e'},
        {key: 'f'},
        {key: 'g'},
        {key: 'h'},
    ]
    renderItem = (item, index) => {
        const {navigator} = this.props;
        return <FullScreenDeviceListItem navigator={navigator}/>
    }
    render(){
        return(
            <FlatList
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
        {key: 'e'},
        {key: 'f'},
        {key: 'g'},
        {key: 'h'},
    ]

    renderItem = (item, index) => {
        const {navigator} = this.props;
        return <PlaceItem navigator={navigator}/>
    }

    render() {
        const {date, time, imgUrl} = this.props;
        return (
            <FlatList
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
        {key: 'd'},
        {key: 'e'},
        {key: 'f'},
        {key: 'g'},
        {key: 'h'},
        {key: 'i'},
        {key: 'j'},
        {key: 'k'}
    ]

    renderItem = (item, index) => {
        return <SectionItem/>
    }

    render() {
        return (

            <FlatList
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
                    <View style={styles.layerMask}></View>
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
    render() {
        const {alarmImage, alarmName, style} = this.props
        return (
            <View style={[styles.alarmItem, style]}>
                <Touchable style={styles.alarmImageContainer}>
                    <Image source={alarmImage} style={styles.alarmImage}></Image>
                </Touchable>
                <Text style={styles.alarmName}>{alarmName}</Text>
            </View>
        )
    }
}

class AlarmLayer extends PureComponent {
    render() {
        const {isRender, changeIsRender} = this.props;
        return (
            isRender ?
                <View style={styles.layerContainer}>
                    <View style={styles.layerMask}></View>
                    <View style={styles.alarmLayer}>
                        <View style={styles.alarmRow}>
                            <AlarmLayerItem alarmImage={Fire} style={{marginRight: 50}} alarmName="火灾"/>
                            <AlarmLayerItem alarmImage={Steal} style={{marginLeft: 50}} alarmName="盗抢"/>
                        </View>
                        <View style={styles.alarmRow}>
                            <AlarmLayerItem alarmImage={Hurt} style={{marginRight: 50}} alarmName="伤害"/>
                            <AlarmLayerItem alarmImage={Other} style={{marginLeft: 50}} alarmName="其他"/>
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

function createDate(){
    let date = {};
    for(let i=1993;i<2017;i++){
        let month = {};
        for(let j = 1;j<13;j++){
            let day = [];
            if(j === 2){
                for(let k=1;k<29;k++){
                    day.push(k+'日');
                }
            }
            else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                for(let k=1;k<32;k++){
                    day.push(k+'日');
                }
            }
            else{
                for(let k=1;k<31;k++){
                    day.push(k+'日');
                }
            }
            month[j+'月'] = day;
        }
        date[i+'年'] = month;
    }
    return date;
};

class ReviewLayer extends PureComponent {

    constructor(props, context) {
        super(props, context);
    }

    _onPressHandle() {
        this.picker.show();
    }

    componentDidMount() {
        this.props.isRender ?
            this._onPressHandle()
            :
            console.log('review not render')
    }

    render() {
        const {isRender, changeIsRender} = this.props;
        return (
            isRender ?
                <View style={styles.layerContainer}>
                    <View style={styles.layerMask}></View>
                    <View style={styles.reviewLayer}>
                        <View style={{
                            height: 205,
                            position: 'relative',
                            backgroundColor: 'transparent'
                        }}>
                            <Picker
                                ref={picker => this.picker = picker}
                                style={{height: 205, width: 360}}
                                showDuration={300}
                                showMask={true}
                                pickerData={createDate()}
                                selectedValue={['2015年', '12月', '12日']}
                                pickerToolBarStyle={{height: 0, opacity: 0}}
                                onPickerDone={(pickedValue) => {
                                    console.log(pickedValue);
                                }}
                            />
                        </View>

                        <View style={styles.reviewLayerButtonContainer}>
                            <Touchable style={styles.reviewLayerButton} onPress={changeIsRender}>
                                <Text style={styles.reviewLayerButtonText}>取消</Text>
                            </Touchable>
                            <Touchable style={styles.reviewLayerButton}>
                                <Text style={styles.reviewLayerButtonText}>确认</Text>
                            </Touchable>
                        </View>
                    </View>
                </View>
                :
                null
        )
    }
}

class DeviceItem extends PureComponent {
    render() {
        return (
            <Touchable style={styles.deviceItem}>
                <Text style={styles.deviceItemNumber}>1</Text>
                <View style={styles.deviceItemIntro}>
                    <Text style={styles.deviceItemName}>康乐社区东门路口一</Text>
                    <Text style={styles.deviceItemState}>正在播放</Text>
                </View>
                <Image style={{width: 21, height: 21, resizeMode: 'stretch', marginRight: 15}}
                       source={PlayArrow}></Image>
            </Touchable>

        )
    }
}

class DeviceLayer extends PureComponent {
    data = [
        {key: 'a'},
        {key: 'b'},
        {key: 'c'},
        {key: 'd'},
        {key: 'e'},
        {key: 'f'},
        {key: 'g'},
    ]
    renderItem = (item, index) => {
        return (<DeviceItem/>)
    }

    render() {
        const {isRender, changeIsRender} = this.props;
        return (
            isRender ?
                <View style={styles.layerContainer}>
                    <View style={styles.layerMask}></View>
                    <View style={styles.deviceLayer}>
                        <View style={styles.deviceTitleContainer}>
                            <Text style={styles.deviceListTitle}>监控设备列表</Text>
                            <Touchable style={styles.deviceListCloseContainer} onPress={changeIsRender}>
                                <Text style={styles.deviceListClose}>关闭</Text>
                            </Touchable>
                        </View>
                        <View style={{height: 1, backgroundColor: '#F0F0F0'}}></View>
                        <FlatList
                            data={this.data}
                            renderItem={this.renderItem}
                            getItemLayout={(data, index) => ( {length: 56, offset: 56 * index, index} )}
                        />
                    </View>
                </View>
                :
                null
        )
    }
}

export default class SecurityLiveView extends PureComponent {
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
        const {navigator} = props;
        const routers = navigator.getCurrentRoutes();
        const top = routers[routers.length - 1];
        top.handleBack = this.handleBack;
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    handleBack = () => {
        if (this.video.state.isFull) {
            this.video.setFullScreen();
        } else {
            this.video.onPause();
            this.props.navigator.pop();
        }
    }

    componentWillUpdate(nextProps, nextState) {
        LayoutAnimation.spring();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isRender: true,
                playUri: 'http://bofang.bati.cc/rr/HongMaoLanTuHuoFengHuang_hd.m3u8'
                //playUri:'http://gslb.hrtn.net:8080/live/coship,TWSX1421638319994522.m3u8?fmt=x264_0k_mpegts&sora=1&sk=C90839043C325195586FA305460BE05E&uuid=bab357c2-1be7-40cf-9883-67d9547a8f6f&userCode=hrb002&userName=hrb002&spCode=484581254562&productCode=dpacdb100&resourceCode=102400201&subId=99999999&resourceName=&authType=2'
            })
        })
    }

    onLayout = (e) => {
        let {y} = e.nativeEvent.layout;
        this.setState({
            layoutTop: y + $.STATUS_HEIGHT
        })
    }

    alertSomething(something) {
        alert(something);
    }

    changeShoutLayerRender = () => {
        this.setState({shoutLayerRender:!this.state.shoutLayerRender});
    }

    changeAlarmLayerRender=()=>{
        this.setState({alarmLayerRender:!this.state.alarmLayerRender});
    }

    changeDeviceLayerRender=()=>{
        this.setState({deviceLayerRender:!this.state.deviceLayerRender});
    }

    changeReviewLayerRender=()=>{
        this.setState({reviewLayerRender:!this.state.reviewLayerRender});
    }

    render() {
        const {navigator, route} = this.props;
        const {isRender, layoutTop, playUri} = this.state;
        return (
            <View style={styles.content}>
                <View style={{flex:1}}>
                    <StatusBar barStyle='light-content'
                               backgroundColor='transparent'/>
                    <View onLayout={this.onLayout} style={styles.videoCon}></View>
                    {
                        isRender && <Video ref={(ref) => {
                            this.video = ref
                        }} handleBack={this.handleBack} playUri={playUri} style={{top: layoutTop}}/>
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
                <AlarmLayer isRender={this.state.alarmLayerRender} changeIsRender={this.changeAlarmLayerRender}/>
                <ReviewLayer isRender={this.state.reviewLayerRender} changeIsRender={this.changeReviewLayerRender}/>
                <DeviceLayer isRender={this.state.deviceLayerRender} changeIsRender={this.changeDeviceLayerRender}/>
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
        zIndex: 1000,

    },
    layerMask: {
        flex: 1,
        backgroundColor: 'black',
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
        backgroundColor:'white'
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
        backgroundColor:'white'
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
        width: 55,
        height: 56,
        fontSize: 10,
        color: '#333333',
        alignSelf: 'center',
        textAlignVertical: 'center',
        textAlign: 'center',
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
        fontSize: 10,
        color: '#666666'
    },
    deviceListCloseContainer: {
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    reviewLayer: {
        width: $.WIDTH,
        height: 258,
        position: 'absolute',
        left: 0,
        bottom: 0,
        backgroundColor:'#fff'
    },
    reviewLayerButtonContainer: {
        height: 53,
        flexDirection: 'row'
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