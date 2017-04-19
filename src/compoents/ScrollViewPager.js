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
    timer = null;
    componentWillUnmount(){
        this.timer&&clearTimeout(this.timer);
    }
    componentDidMount(){
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            this.tab.measure((a, b, width, height, px, py)=>{
                this.props.layout(width+30)
            })
        })
    }
    render(){
        return(
            <Touchable onPress={this.props.onPress} style={styles.tabbaritem}><Text ref={(tab)=>this.tab=tab} onLayout={this.layout} style={styles.tabbartext}>{this.props.title}</Text></Touchable>
        )
    }
}

export default class ScrollViewPager extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 0,
            tabs:['栏目一一','栏目二二一','栏目三121','栏目454544544一一','栏目','121栏目一一','78787栏目'],
            xoffset:0
        }
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    tabswidth = [];

    tabsdir = [0];

    onPageSelected = (pageIndex) => {
        this.xScroll(pageIndex);
        LayoutAnimation.configureNext({
            duration: 200,
            update: {
                type: 'easeInEaseOut'
            }
        });
    }
    xScroll = (pageIndex) => {
        let {xoffset} = this.state;
        if(this.tabsdir[pageIndex]+this.tabswidth[pageIndex]-WIDTH>xoffset){
            xoffset+=this.tabsdir[pageIndex]+this.tabswidth[pageIndex]-WIDTH+30;
            this.tabbar.scrollTo({x: xoffset, y: 0, animated: true});
        }else if(xoffset>this.tabsdir[pageIndex]){
            xoffset-=xoffset-this.tabsdir[pageIndex]+30;
            this.tabbar.scrollTo({x: xoffset, y: 0, animated: true});
        }
        this.setState({xoffset,pageIndex})
    }

    onContentSizeChange = (contentWidth) => {
        //alert(contentWidth)
    }

    onSetPage = (pageIndex) => {
        LayoutAnimation.spring();
        this.xScroll(pageIndex);
        this.viewpager.setPage(pageIndex);
    }

    layout = (width)=> {
        this.tabswidth.push(width);
        this.tabsdir.push(this.tabswidth.reduce((a,b)=>a+b));
    }

    scrollEnd = (e) => {
        let xoffset = e.nativeEvent.contentOffset.x;
        this.setState({xoffset});
    }
    
    render() {
        const { pageIndex,tabsdir } = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.scrolltabbar}>
                    <ScrollView
                        onContentSizeChange={this.onContentSizeChange}
                        ref={(tabbar) => this.tabbar = tabbar}
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={this.scrollEnd}
                        horizontal={true}
                    >
                        {
                            this.state.tabs.map((item,i)=>(
                                <Tabs onPress={()=>this.onSetPage(i)} key={i} title={item} layout={this.layout} />
                            ))
                        }
                        <View style={[styles.tabline, { width:this.tabswidth[pageIndex]||100,left: this.tabsdir[pageIndex] }]}></View>
                    </ScrollView>
                </View>
                <ViewPager
                    ref={(viewpager) => this.viewpager = viewpager}
                    onPageSelected={this.onPageSelected}
                >
                    <ScrollView style={{ flex: 1 }}>
                        <Banner />
                        <View><Text>{this.tabswidth}</Text></View>
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