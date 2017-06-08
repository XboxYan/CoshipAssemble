import './util/Global';
import React, { PureComponent } from 'react';
import {
    StatusBar,
    Navigator,
    AppRegistry,
    BackAndroid,
    Dimensions,
    ToastAndroid,
    View,
} from 'react-native';
import Home from './Home';
import Orientation from 'react-native-orientation';
import Store from './util/LoginStore';
import notification from './Notification';

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
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true;
        }
    }

    componentDidMount() {
        storage.load({
            key: 'userInfo',
        }).then(ret=>{
            Store.setUserInfo(ret);
            Store.setState(true);
            ToastAndroid.show(`用户${ret.nickName}登录成功`, ToastAndroid.SHORT);
        }).catch(err => {
            Store.setState(false);
            ToastAndroid.show('用户未登录', ToastAndroid.SHORT);
        })
        Orientation.lockToPortrait();
        BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);

        notification.navigator = this.navigator;
    }
    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
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

    render() {
        return (
            <View style={{ flex: 1 }}>
                <StatusBar translucent={true} barStyle='dark-content' backgroundColor='#fff' />
                <Navigator
                    ref={(nav) => this.navigator = nav}
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
