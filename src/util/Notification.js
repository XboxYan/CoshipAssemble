/* @flow */

import {
    Alert,
    DeviceEventEmitter,
    Platform,
} from 'react-native';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';

import LiveContentView from '../pages/Channel/LiveContentView'

const BTN_YES = '立即观看';
const BTN_NO = '知道了';

class Notification {
    navigator = null;

    isIOS = Platform.OS === 'ios';

    constructor(){
        PushNotification.configure({
            onNotification: (notification) => {
                const {foreground, message, userInfo, data} = notification;
                const channel = this.isIOS ? data : userInfo;
                if(this.isIOS && foreground){
                    const self = this;
                    Alert.alert('预约提醒', `您预约${channel.channelName}的${channel.playProgram}即将开始`, [{
                        text : BTN_NO
                    },{
                        text : BTN_YES,
                        onPress : () => self._playChannel(channel)
                    }]);
                }else{
                    this._playChannel(channel);
                }
            }
        });
    }

    _playChannel(channel:Object){
        this.navigator && this.navigator.push({
            name:LiveContentView,
            channel: channel
        })
    }

    sendLocalNotification(program:Object){
        const {channelId, channelName, programName, startTime} = program;
        PushNotification.localNotificationSchedule({
            userInfo: {
                channelId : channelId,
                channelName : channelName,
                playProgram : programName,
            },
            message: `您预约${channelName}的${programName}即将开始, 点击观看`, // (required)
            date: moment(startTime).toDate(),
            number:0, // (required),
        });
    }

    clearAll(){
        PushNotification.cancelAllLocalNotifications();
    }
}

const notification = new Notification();
export default notification;
