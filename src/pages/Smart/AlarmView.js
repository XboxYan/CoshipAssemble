import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    Image,
    TextInput,
    ScrollView,
    FlatList,
    UIManager,
    LayoutAnimation,
    InteractionManager,
    View,
} from 'react-native';

import Toast from 'react-native-root-toast';
import Loading from '../../compoents/Loading'
import Touchable from '../../compoents/Touchable';
import Appbar from '../../compoents/Appbar'

import fetchSecurity from '../../util/FetchSecurity'

import {observable, action, computed} from 'mobx';
import {observer} from 'mobx-react/native';

const PositionIcon = require('../../../img/icon_security_alarm_position.png');
const DetailIcon = require('../../../img/icon_security_alarm_detail.png');
const NameIcon = require('../../../img/icon_security_alarm_name.png');
const PhoneIcon = require('../../../img/icon_security_alarm_phone.png');

@observer
export default class extends PureComponent {
    @observable alarmManName = '';
    @observable phoneNumber = '';
    @observable alarmAddress = '';
    @observable alarmMessage = '';

    onHandle = () => {
        if (this.isNull(this.alarmManName)) {
            Toast.show("报警人名字不能为空")
        } else if (this.isNull(this.phoneNumber)) {
            Toast.show("报警人电话不能为空")
        } else if(isNaN(this.phoneNumber)){
            Toast.show("电话号码必须为纯数字")
        }else if (this.isNull(this.alarmAddress)) {
            Toast.show("警情所在地不能为空")
        } else {
            const {navigator, route} = this.props;
            const {alarmType, deviceId} = route;
            //alert(this.alarmManName+':'+this.phoneNumber+':'+this.alarmAddress+':'+this.alarmMessage+':'+alarmType+':'+deviceId)
            fetchSecurity('AddAlarmMessage', {
                par: {
                    alarmManName: this.alarmManName,
                    phoneNumber: this.phoneNumber,
                    alarmAddress: this.alarmAddress,
                    alarmMessage: this.alarmMessage,
                    alarmType: alarmType,
                    deviceId: deviceId
                }
            }, (data) => {
                if (data.returnCode == '0') {
                    Toast.show("提交成功");
                    navigator.pop();
                } else {
                    Toast.show("提交失败，请检查网络状况");
                }
            });

        }
    }

    isNull = (str) => {
        if (str == "") return true;
        var regu = "^[ ]+$";
        var re = new RegExp(regu);
        return re.test(str);
    }

    render() {
        const {navigator} = this.props;
        return (
            <View style={styles.content}>
                <Appbar title="报警信息" navigator={navigator}/>
                <View style={styles.mainContent}>
                    <View style={styles.rowTextInput}>
                        <Image style={styles.rowIcon} source={NameIcon}/>
                        <TextInput onChangeText={(alarmManName) => this.alarmManName = alarmManName}
                                   style={styles.rowText} placeholder={"请输入名字"}/>
                    </View>
                    <View style={styles.rowTextInput}>
                        <Image style={styles.rowIcon} source={PhoneIcon}/>
                        <TextInput onChangeText={(phoneNumber) => this.phoneNumber = phoneNumber} style={styles.rowText}
                                   placeholder={"请输入联系电话"}/>
                    </View>
                    <View style={styles.rowTextInput}>
                        <Image style={styles.rowIcon} source={PositionIcon}/>
                        <TextInput onChangeText={(alarmAddress) => this.alarmAddress = alarmAddress}
                                   style={styles.rowText} placeholder={"请输入警情所在地"}/>
                    </View>
                    <View style={styles.rowTextInput}>
                        <Image style={styles.rowIcon} source={DetailIcon}/>
                        <TextInput onChangeText={(alarmMessage) => this.alarmMessage = alarmMessage}
                                   style={styles.rowText} placeholder={"请输入详细描述"}/>
                    </View>

                    <Touchable onPress={this.onHandle} style={{
                        marginTop: 38,
                        borderRadius: 5,
                        height: 40,
                        width: 0.72 * $.WIDTH,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: $.COLORS.mainColor
                    }}>
                        <Text style={{fontSize: 14, color: 'white'}}>提交</Text>
                    </Touchable>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        backgroundColor: 'white',
        flex: 1
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rowTextInput: {
        flexDirection: 'row',
        width: 0.72 * $.WIDTH,
        alignItems: 'center',
        height: 40,
    },
    rowIcon: {
        width: 20,
        height: 20
    },
    rowText: {
        flex: 1,
        paddingLeft: 10,
        height: 40,
    }
})