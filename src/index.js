import './util/Global';
import React, { PureComponent } from 'react';
import {
    StatusBar,
    Navigator,
    AppRegistry,
    BackAndroid,
    Dimensions,
    View,
} from 'react-native';
import Home from './Home';
import Orientation from 'react-native-orientation';
import Toast from 'react-native-root-toast';

import Store from './util/LoginStore';
import programOrder from './util/ProgramOrder';
import notification from './util/Notification';
import fetchData from './util/Fetch';

//非开发环境去掉log
if (!__DEV__) {
    global.console = {
        info: () => { },
        log: () => { },
        warn: () => { },
        error: () => { },
    };
}

class Assemble extends PureComponent {

    constructor(){
        super();
        this.state = {
            load:false
        }
        Orientation.lockToPortrait();
    }

    onBackAndroid = () => {
        const navigator = this.navigator;
        const routers = navigator.getCurrentRoutes();
        if (routers.length > 1) {
            const top = routers[routers.length - 1];
            const handleBack = top.handleBack;
            if (handleBack) {
                // 路由或组件上决定这个界面自行处理back键
                handleBack();
            } else {
                // 默认行为： 退出当前界面。
                navigator.pop();
            }
            return true;
        } else {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                return false;
            }
            this.lastBackPressed = Date.now();
            Toast.show('再按一次退出应用');
            return true;
        }
    }

    componentDidMount() {
        storage.load({
            key: 'portalData',
        }).then(ret=>{
            global.portalId = ret.portalid;
		    global.Base = ret.portalurl;
            this._autoLogin();
            this._initServerConfig();
            this.setState({load:true});
            //Toast.show(global.portalId);
        }).catch(err => {
            //global.Base = 'http://10.9.219.24:8080/';
            //global.portalId = '50001';
            this._autoLogin();
            this._initServerConfig();
            this.setState({load:true});
            //Toast.show(global.portalId);
        })


        BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
    }
    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
    }

    _autoLogin(){
        storage.load({
            key: 'userInfo',
        }).then(ret=>{
            return fetchData('Login',{
                par:{
                    userCode: ret.userCode,
                    passWord: ret.passWord
                }
            }, ({success, userInfo})=>{
                if(success){
                    userInfo.passWord = ret.passWord;
                    Store.setUserInfo(userInfo);
                    Store.setState(true);
                    Toast.show(`用户${userInfo.nickName}登录成功`);
                    storage.save({
                        key: 'userInfo',
                        data: userInfo,
                    });
                    programOrder.refresh();
                }else{
                    Store.setState(false);
                    Toast.show(`用户登录信息过期，请重新登录`);
                }
            })
        }).catch(err => {
            Store.setState(false);
            Toast.show('用户未登录');
        })
    }

    _initServerConfig(){
        fetchData('GetParam', {}, (datas)=>{
            if(datas&&datas.paramList){
                datas.paramList.forEach((cfg)=>{
                    if(cfg.param == 'live'){
                        global.BASE_LIVE = cfg.data;
                    }else if(cfg.param == 'smart'){
                        global.BASE_SMART = cfg.data;
                    }else if(cfg.param == 'security'){
                        global.BASE_SECURITY = cfg.data;
                    }
                })
            }
        })
    }

    renderScene(route, navigator) {
        let Component = route.name;
        return (
            <Component navigator={navigator} route={route} />
        );
    }

    configureScene = (route, routeStack) => {
        let configure = Navigator.SceneConfigs.PushFromRight;//默认
        if(route.SceneConfigs){
            configure = Navigator.SceneConfigs[route.SceneConfigs];
        }
        return {
            ...configure,
            gestures: null
        }
    }

    _navigatorRef = (ref) => {
        this.navigator = ref;
        notification.navigator = ref;
    }

    render() {
        if(!this.state.load){
            return null
        }
        return (
            <View style={{ flex: 1 }}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='#fff' />
                <Navigator
                    ref={this._navigatorRef}
                    sceneStyle={{flex: 1,backgroundColor:'#f1f1f1'}}
                    initialRoute={{ name: Home }}
                    configureScene={this.configureScene}
                    renderScene={this.renderScene}
                />
            </View>
        )
    }
}

AppRegistry.registerComponent('CoshipAssemble', () => Assemble);
