import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
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

//全局路由
const App = StackNavigator({
  MainTab: { screen: MainTab },
},StackNavigatorConfig)

module.exports = App;