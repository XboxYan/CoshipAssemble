import React, { PureComponent } from 'react';
import {
  BackAndroid,
  ToastAndroid,
  View,
} from 'react-native';

import Home from './Home';

export default class App extends PureComponent {

    onBackAndroid = ()=>{
        const {navigator} = this.props;
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

    render() {
        const {navigator} = this.props;
        return (
          <Home navigator={navigator}  />
        )
    }
}
