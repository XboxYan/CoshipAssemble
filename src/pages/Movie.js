import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TabItem from '../compoents/TabItem';

export default class Movie extends React.PureComponent {
    static navigationOptions = {
        tabBar: {
            icon: ({ focused,tintColor }) => <TabItem label="影视" tintColor={tintColor} />,
        },
    }
    render(){
        return (
            <Text>这是影视页面！</Text>
        )
    }
}