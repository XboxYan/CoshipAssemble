import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TabItem from '../compoents/TabItem';

export default class Live extends React.PureComponent {
    static navigationOptions = {
        tabBar: {
            icon: ({ focused,tintColor }) => <TabItem label="同洲直播" tintColor={tintColor} />,
        },
    }
    render(){
        return (
            <Text>这是同洲直播页面！</Text>
        )
    }
}