import {NativeModules} from 'react-native'
import {PureComponent} from 'react';
import { observable, action, computed, autorun} from 'mobx';

/**
*/
const SystemSettingNative = NativeModules.SystemSetting;

export default class SystemSetting{
    @observable static brightness;
    static saveVal = 0 ;

    static async init(){
        if(!SystemSetting.brightness){
            const val = await SystemSetting.getBrightness();
            SystemSetting.saveVal = val;
            SystemSetting.brightness = val;
        }
    }

    /** 获取系统亮度，0到1之间，1为最亮*/
    static async getBrightness(){
        return await SystemSettingNative.getBrightness();
    }

    /** 设置系统亮度，0到1之间，1为最亮 */
    static setBrightness(val){
        val = val > 1 ? 1 : (val < 0 ? 0 : val)
        SystemSettingNative.setBrightness(val);
    }

    /** 保存当前亮度，配合restore()实现亮度恢复 */
    static async saveBright(){
        SystemSetting.saveVal = SystemSetting.brightness;
    }

    /** 恢复亮度，恢复到最近一次调用save()时的亮度 */
    @action
    static restoreBright(){
        SystemSetting.brightness = SystemSetting.saveVal;
    }
}

SystemSetting.init();

autorun(() => {
    let val = SystemSetting.brightness;
    if(val){
        val = val > 1 ? 1 : (val < 0 ? 0 : val);
        SystemSetting.setBrightness(val);
    }
})
