import React, { PureComponent } from 'react';
import {
  StatusBar,
  Navigator,
  AppRegistry,
  Dimensions,
  BackAndroid,
  ToastAndroid,
  Platform,
  View,
} from 'react-native';
import Home from './Home';
const {width,height} = Dimensions.get('window');
//常用全局变量
global.WIDTH = width;
global.HEIGHT = height;
global.StatusBarHeight = Platform.OS==='ios'?20:(Platform.Version>19?StatusBar.currentHeight:0);

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
            <StatusBar translucent={true} backgroundColor='transparent' />
            <Navigator
                ref={(nav)=>this.navigator=nav}
                initialRoute={{ name: Home }}
                configureScene={(route) => Object.assign(Navigator.SceneConfigs.PushFromRight, { gestures: null })}
                renderScene={this.renderScene}
            />
          </View>
        )
    }
}

AppRegistry.registerComponent('CoshipAssemble', () => Assemble);
