import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  ToastAndroid,
  BackAndroid,
  View,
} from 'react-native';
import { TabNavigator,StackNavigator,TabView } from 'react-navigation';

import Movie from './pages/Movie';
import Community from './pages/Community';
import Live from './pages/Live';
import Me from './pages/Me';

//Stack路由配置（隐藏默认头部）
const StackNavigatorConfig = {
  headerMode:'none'
}

//Tab配置（底部Tab导航）
const TabNavigatorConfig = {
  tabBarPosition :'bottom',
  tabBarComponent :TabView.TabBarBottom,
  animationEnabled:false,
  swipeEnabled:false,
  backBehavior:'none',
  lazyLoad:true,//懒加载
  tabBarOptions:{
    showLabel:false,
    inactiveTintColor:'#666',
    activeTintColor:'orangered',
    style:{
      borderTopWidth:0,
      backgroundColor:'#f1f1f1'
    }
  }
}

//底部Tab切换配置
const MainTab = TabNavigator({
  Movie: { screen: Movie },
  Community: { screen: Community },
  Live: { screen: Live },
  Me: { screen: Me },
},TabNavigatorConfig)

//全局路由栈
const Stack = StackNavigator({
  MainTab: { screen: MainTab },
},StackNavigatorConfig)

export default class App extends React.PureComponent {

    handleBackPress = () => {
        const { state } = this.stack._navigation;
        if (state.routes.length > 1) {
            const handleBack = state.handleBack;
            if (handleBack) {
                handleBack()
            }
            // const top = routers[routers.length - 1];
            // if (top.ignoreBack) {
            //     // 路由或组件上决定这个界面忽略back键
            //     return true;
            // }
            // const handleBack = top.handleBack;
            // if (handleBack) {
            //     // 路由或组件上决定这个界面自行处理back键
            //     handleBack();
            // } else {
            //     // 默认行为： 退出当前界面。
            //     navigator.pop();
            // }
            // return true;
        } else {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                return false;
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true;
        }
    };
    componentDidMount() {
        BackAndroid.addEventListener('hardwareBackPress', this.handleBackPress);
    }
    componentWillUnmount() {
        BackAndroid.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    render() {
        return <Stack ref={stack => { this.stack = stack; }} />
    }
}
