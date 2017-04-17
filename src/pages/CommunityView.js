import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TabItem from '../compoents/TabItem';

export default class Community extends React.PureComponent {
    static navigationOptions = {
        tabBar: {
            icon: ({ focused,tintColor }) => <TabItem label="惠生活" tintColor={tintColor} />,
        },
    }
    render(){
        return (
            <Text>这是惠生活页面！</Text>
        )
    }
}