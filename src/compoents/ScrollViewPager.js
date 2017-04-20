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
            initialWidth:0
        }
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    //记录tab的宽度
    tabswidth = [];
    //记录tab的位置
    tabsdir = [];
    //记录滚动位置
    xoffset = 0;

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
        if(this.tabsdir[pageIndex]+this.tabswidth[pageIndex]-WIDTH>this.xoffset){
            this.xoffset=this.tabsdir[pageIndex]+this.tabswidth[pageIndex]-WIDTH+30;
            let last = this.tabsdir.length-1;
            let max = this.tabsdir[last]+this.tabswidth[last]-WIDTH;
            this.xoffset=this.xoffset>=max?max:this.xoffset;
            this.tabbar.scrollTo({x: this.xoffset, y: 0, animated: true});
        }else if(this.xoffset>this.tabsdir[pageIndex]){
            this.xoffset=this.tabsdir[pageIndex]-30;
            this.xoffset=this.xoffset>=0?this.xoffset:0;
            this.tabbar.scrollTo({x: this.xoffset, y: 0, animated: true});
        }
        this.setState({pageIndex})
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
        backgroundColor: 'orangered',
    },
    tabbaritem: {
        paddingHorizontal: 15,
        height: 40,
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