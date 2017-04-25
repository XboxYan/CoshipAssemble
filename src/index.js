import './util/Global';
import React, { PureComponent } from 'react';
import {
  StatusBar,
  Navigator,
  AppRegistry,
  BackAndroid,
  ToastAndroid,
  View,
} from 'react-native';
import Home from './Home';

//非开发环境去掉log
if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {},
  };
}

class Assemble extends PureComponent {

    onBackAndroid = ()=>{
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
        BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
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

    render() {
        return (
          <View style={{ flex: 1 }}>
            <StatusBar translucent={false} barStyle='dark-content' backgroundColor='#fff' />
            <Navigator
                ref={(nav)=>this.navigator=nav}
                sceneStyle={{flex:1,backgroundColor:'#f0f0f0'}}
                initialRoute={{ name: Home }}
                configureScene={(route) => Object.assign(Navigator.SceneConfigs.PushFromRight, { defaultTransitionVelocity: 10,gestures: null })}
                renderScene={this.renderScene}
            />
          </View>
        )
    }
}

AppRegistry.registerComponent('CoshipAssemble', () => Assemble);
