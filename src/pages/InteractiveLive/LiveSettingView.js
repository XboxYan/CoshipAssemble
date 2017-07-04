/* @flow */

import React, {PureComponent} from 'react';
import {View, Text, StyleSheet,StatusBar,PixelRatio,TextInput, Picker,Keyboard,TouchableWithoutFeedback,Modal} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { observable, action, computed,autorun} from 'mobx';
import { observer } from 'mobx-react/native';

import Appbar from '../../compoents/Appbar';
import Touchable from '../../compoents/Touchable';
import fetchLive from './FetchLive';
import Store from '../../util/LoginStore';

@observer
export default class LiveSettingView extends PureComponent {

    roomId = Store.userInfo.liveUserInfo.roomInfo.roomCode;
    @observable onlineNum = 0;
    @observable showModal = false;

    @computed get datas(){
        return [{
            name: '房间ID',
            value: this.roomId
        },{
            name: '关注数',
            value: this.onlineNum
        }];
    }

    componentDidMount(){
        const {modUserInfo} = this.props.route;
        fetchLive('queryOnlineNum',{
            resourceCode:Store.liveUserCode
        },({data})=>{
            if(data){
                this.onlineNum = data.focusNum;
            }
        })
    }

    _choose = (bitrate)=>{
        const {modUserInfo} = this.props.route;
        modUserInfo.chooseBitrate(bitrate);
        this.showModal = false;
    }

    render() {
        const {modUserInfo} = this.props.route;
        const {bitrateDatas,bitrateTxt,content} = modUserInfo;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <StatusBar translucent={true} barStyle='dark-content' backgroundColor='#fff'/>
                        <Appbar title="直播设置" navigator={this.props.navigator}/>
                        <ChooesBitrate
                            showModal={this.showModal}
                            hideModalFunc={()=>this.showModal=false}
                            bitrateDatas={bitrateDatas}
                            choose={this._choose}
                            bitrateTxt={bitrateTxt}
                        />
                        <View style={styles.card}>
                            <View style={styles.content}>
                                <Text style={styles.roomContent}>房间公告</Text>
                            </View>
                            <View style={styles.hasLine}/>
                            <TextInput
                                style={styles.contentText}
                                multiline={true}
                                underlineColorAndroid="transparent"
                                returnKeyType="done"
                                selectionColor="#aaa"
                                value={content}
                                onChangeText={(text)=>modUserInfo.content=text}
                            />
                        </View>
                        <View style={styles.card}>
                            {
                                this.datas.map(({name, value}, index)=><LineView key={index} name={name} value={value} hasLine={index > 0}/>)
                            }
                        </View>
                        <View style={styles.card}>
                            <LineView name={'视频质量'} value={bitrateTxt} more={()=>this.showModal=true}/>
                        </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const ChooesBitrate = observer(({showModal, hideModalFunc, bitrateTxt, bitrateDatas,choose})=>{
    return (
        <Modal
            animationType={"fade"}
            transparent={true}
            visible={showModal}
            supportedOrientations={['portrait', 'landscape']}
            onRequestClose={hideModalFunc}
            >
                <TouchableWithoutFeedback onPress={hideModalFunc}>
                    <View style={styles.fullScreenView}>
                        <View style={styles.dialog}>
                            {
                                bitrateDatas.map((bitrate,index)=>{
                                    return(
                                        <Touchable style={styles.choose} key={index} onPress={()=>choose(bitrate)}>
                                            <Text style={styles.bitrateItem}>{bitrate.bitRateName}</Text>
                                            {
                                                bitrate.bitRateName ==bitrateTxt &&
                                                <Icon style={{position:'absolute', right:0}} name='done' size={24} color={$.COLORS.mainColor} />
                                            }
                                        </Touchable>
                                    )
                                })
                            }
                        </View>
                    </View>
            </TouchableWithoutFeedback>
        </Modal>
    )
})

const LineView = ({name, value, hasLine, more})=>{
    return (<View>
            {
                hasLine&&<View style={styles.hasLine}/>
            }
            <Touchable activeOpacity={more?0.6:0.6} style={styles.row} onPress={more?more:Keyboard.dismiss}>
                <Text style={{flex:1, fontSize: 15, color:'#000'}}>{name}</Text>
                <Text style={{fontSize:14, color:'#999'}}>{value}</Text>
                {
                    more&&<Icon name='keyboard-arrow-right' size={30} color={$.COLORS.subColor} />
                }
            </Touchable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    content:{
        flex:1,
    },
    card:{
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    content:{
        height: 36,
        borderTopWidth: 1/PixelRatio.get(),
        borderColor: '#eee',
        justifyContent: 'center',
        alignItems: 'center',
    },
    roomContent:{
        textAlign: 'center',
        fontSize: 14,
        textAlignVertical: 'center',
    },
    contentText:{
        height:120,
        paddingHorizontal: 16,
        padding:0,
        textAlignVertical:'top',
    },
    row:{
        paddingHorizontal:16,
        height:36,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hasLine:{
        marginLeft:16,
        height:1/PixelRatio.get(),
        backgroundColor: '#D0D0D0',
    },
    fullScreenView:{
        flex:1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent:'center',
        alignItems: 'center',
    },
    dialog:{
        backgroundColor: '#fff',
        borderRadius: 6,
        width: 180,
        paddingVertical: 16,
        justifyContent:'center',
        alignItems: 'center',
    },
    choose:{
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        width: 150,
        height:36,
    },
    bitrateItem:{
        backgroundColor: 'rgba(0,0,0,0)',
        paddingVertical: 8,
        fontSize: 18,
    }
});
