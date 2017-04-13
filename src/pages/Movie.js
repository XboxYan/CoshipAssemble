import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import TabItem from '../compoents/TabItem';
import ViewPager from '../compoents/ViewPager';

export default class Movie extends React.PureComponent {
    static navigationOptions = {
        tabBar: {
            icon: ({ focused,tintColor }) => <TabItem label="影视" tintColor={tintColor} />,
        },
    }
    render(){
        return (
            <View style={{flex:1}}>
                <Text>这是影视页面！</Text>
                <ViewPager height={400}>
                    <View><Text>1111</Text></View>
                    <View><Text>2222</Text></View>
                    <View><Text>3333</Text></View>
                </ViewPager>
            </View>
        )
    }
}