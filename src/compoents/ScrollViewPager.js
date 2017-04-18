import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    UIManager,
    LayoutAnimation,
    ScrollView,
    View,
} from 'react-native';

import Touchable from './Touchable';
import ViewPager from './ViewPager';
import Banner from './Banner';

export default class ScrollViewPager extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 0,
            dir:[]
        }
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    onPageSelected = (pageIndex) => {
        //alert(index)
        //this.refs.viewpager.setPage(index);
        this.setState({ pageIndex })
        LayoutAnimation.configureNext({
            duration: 200,
            update: {
                type: 'easeInEaseOut'
            }
        });
    }
    onLayout = (e)=> {
        let dir = [];
        alert(e.nativeEvent.layout.width)
        dir.push(e.nativeEvent.layout.width)
        this.setState({dir})
    }
    componentDidMount() {
        //this.viewpager.setPage(2)
    }
    render() {
        const { pageIndex,dir } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.scrolltabbar}>
                    <ScrollView
                        ref={(tabbar) => this.tabbar = tabbar}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                    >
                        <Touchable style={styles.tabbaritem}><Text onLayout={this.layout} style={styles.tabbartext}>栏目一一</Text></Touchable>
                        <Touchable style={styles.tabbaritem}><Text onLayout={this.layout} style={styles.tabbartext}>栏目二</Text></Touchable>
                        <Touchable style={styles.tabbaritem}><Text onLayout={this.layout} style={styles.tabbartext}>栏目三</Text></Touchable>
                        <Touchable style={styles.tabbaritem}><Text onLayout={this.layout} style={styles.tabbartext}>栏目四56556</Text></Touchable>
                        <Touchable style={styles.tabbaritem}><Text onLayout={this.layout} style={styles.tabbartext}>栏目五</Text></Touchable>
                        <Touchable style={styles.tabbaritem}><Text onLayout={this.layout} style={styles.tabbartext}>栏目六</Text></Touchable>
                        <Text>{dir}</Text>
                        <View style={[styles.tabline, { left: pageIndex * 80 }]}></View>
                    </ScrollView>
                </View>
                <ViewPager
                    ref={(viewpager) => this.viewpager = viewpager}
                    onPageSelected={this.onPageSelected}
                >
                    <ScrollView style={{ flex: 1 }}>
                        <Banner />
                        <View><Text>2222222</Text></View>
                        <View><Text>111111</Text></View>
                        <View><Text>111111</Text></View>
                        <View><Text>111111</Text></View>
                        <View><Text>111111</Text></View>
                        <View><Text>111111</Text></View>
                    </ScrollView>
                    <Text>222222222222222222</Text>
                    <Text>用户UI与YuiYuihi一</Text>
                    <Text>11111111111111111</Text>
                    <Text>分国有股股市</Text>
                    <Text>哥和嘎嘎嘎好尴尬</Text>
                </ViewPager>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrolltabbar: {
        paddingTop: 24,
        height: 60,
        backgroundColor: 'orangered'
    },
    tabbaritem: {
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    tabline: {
        height: 3,
        borderRadius: 2,
        width: 80,
        position: 'absolute',
        bottom: 1,
        backgroundColor: '#fff',
    },
    tabbartext: {
        fontSize: 14,
        opacity: .8,
        color: '#fff'
    },
});