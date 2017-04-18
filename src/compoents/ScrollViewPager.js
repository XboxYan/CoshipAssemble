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

class Tabs extends PureComponent {
    onLayout = (e)=> {
        let dir = [];
        alert(e)
        //dir.push(e.nativeEvent.layout.width)
        //this.setState({dir})
    }
    componentDidMount(){
        setTimeout(()=>{
            this.tab.measure((a, b, width, height, px, py)=>{
                this.props.layout(width+30)
            })
        })
    }
    render(){
        return(
            <Touchable style={styles.tabbaritem}><Text ref={(tab)=>this.tab=tab} onLayout={this.layout} style={styles.tabbartext}>{this.props.title}</Text></Touchable>
        )
    }
}

export default class ScrollViewPager extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 0,
            tabs:['栏目一一','栏目二二一','栏目三121','栏目454544544一一','栏目','121栏目一一','78787栏目'],
            tabswidth:[],
            tabsdir:[0]
        }
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        //LayoutAnimation.spring();
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
    layout = (width)=> {
        let {tabswidth,tabsdir} = this.state;
        
        tabswidth.push(width);
        tabsdir.push(tabswidth.reduce((a,b)=>a+b));
        this.setState({tabswidth})
        this.setState({tabsdir})
    }
    
    componentWillUpdate(nextProps,nextState){
        //alert(nextState.tabswidth)
        if(nextState.tabswidth != this.state.tabswidth ){
        //alert(5)
        }
    }
    render() {
        const { pageIndex,tabswidth,tabsdir } = this.state;
        //alert(tabswidth[0])
        return (
            <View style={styles.container}>
                <View style={styles.scrolltabbar}>
                    <ScrollView
                        ref={(tabbar) => this.tabbar = tabbar}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                    >
                        {
                            this.state.tabs.map((item,i)=>(
                                <Tabs key={i} title={item} layout={this.layout} />
                            ))
                        }
                        <View style={[styles.tabline, { width:tabswidth[pageIndex],left: tabsdir[pageIndex] }]}></View>
                    </ScrollView>
                </View>
                <ViewPager
                    ref={(viewpager) => this.viewpager = viewpager}
                    onPageSelected={this.onPageSelected}
                >
                    <ScrollView style={{ flex: 1 }}>
                        <Banner />
                        <View><Text>{tabswidth}</Text></View>
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
                    <Text>hjhhjkk</Text>
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