import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TabNavigator,StackNavigator } from 'react-navigation';

const RecentChatsScreen = ()=><Text>RecentChatsScreen</Text>
const AllContactsScreen = ()=><Text>AllContactsScreen</Text>

const MainTab = TabNavigator({
  Recent: { screen: RecentChatsScreen },
  All: { screen: AllContactsScreen },
})

const App = StackNavigator({
  MainTab: { screen: MainScreenNavigator },
})

module.exports = App;