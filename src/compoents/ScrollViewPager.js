import React, { Component,PureComponent } from 'react';
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

export default class ScrollViewPager extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 0,
            xoffset:0,
            initialWidth:0
        }
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    //记录tab的宽度
    tabswidth = [];
    //记录tab的位置
    tabsdir = [];

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
            let last = this.tabsdir.length-1;
            let max = this.tabsdir[last]+this.tabswidth[last]-WIDTH;
            xoffset=xoffset>=max?max:xoffset;
            this.tabbar.scrollTo({x: xoffset, y: 0, animated: true});
        }else if(xoffset>this.tabsdir[pageIndex]){
            xoffset-=xoffset-this.tabsdir[pageIndex]+30;
            xoffset=xoffset>=0?xoffset:0;
            this.tabbar.scrollTo({x: xoffset, y: 0, animated: true});
        }
        this.setState({xoffset,pageIndex})
    }

    onSetPage = (pageIndex) => {
        LayoutAnimation.spring();
        this.xScroll(pageIndex);
        this.viewpager.setPage(pageIndex);
    }

    onlayout = (e,i)=> {
        let {width,x} = e.nativeEvent.layout;
        this.tabswidth[i]=width;
        this.tabsdir[i]=x;
        if(i===this.state.pageIndex){
            this.setState({initialWidth:width});
            LayoutAnimation.configureNext({
                duration: 200,
                update: {
                    type: 'easeInEaseOut'
                }
            });
        }
    }

    scrollEnd = (e) => {
        let xoffset = e.nativeEvent.contentOffset.x;
        this.setState({xoffset});
    }
    
    render() {
        const { pageIndex,initialWidth } = this.state;
        const tablabel = React.Children.map(this.props.children,child=>child.props.tablabel);
        return (
            <View style={styles.container}>
                <View style={styles.scrolltabbar}>
                    <ScrollView
                        bounces={false}
                        onContentSizeChange={this.onContentSizeChange}
                        ref={(tabbar) => this.tabbar = tabbar}
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={this.scrollEnd}
                        horizontal={true}
                    >
                        {
                            tablabel.map((item,i)=>(
                                <Touchable onLayout={(e)=>this.onlayout(e,i)} key={i} onPress={()=>this.onSetPage(i)} style={styles.tabbaritem}><Text style={styles.tabbartext}>{item}</Text></Touchable>
                            ))
                        }
                        <View style={[styles.tabline, { width:this.tabswidth[pageIndex]||initialWidth,left: this.tabsdir[pageIndex] }]}></View>
                    </ScrollView>
                </View>
                <ViewPager
                    ref={(viewpager) => this.viewpager = viewpager}
                    onPageSelected={this.onPageSelected}
                >
                    {this.props.children}
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
        height: 40,
        backgroundColor: 'orangered',
        alignItems: 'center',
    },
    tabbaritem: {
        paddingHorizontal: 15,
        justifyContent: 'center',
    },
    tabline: {
        height: 3,
        borderRadius: 2,
        width: 0,
        position: 'absolute',
        bottom: 1,
        left:-100,
        backgroundColor: '#fff',
    },
    tabbartext: {
        fontSize: 14,
        opacity: 1,
        color: '#fff'
    },
});