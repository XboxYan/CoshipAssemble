import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TabItem from '../compoents/TabItem';

export default class Me extends React.PureComponent {
    static navigationOptions = {
        tabBar: {
            icon: ({ focused,tintColor }) => <TabItem label="个人" tintColor={tintColor} />,
        },
    }
    render(){
        return (
            <Text>这是个人页面！</Text>
        )
    }
}