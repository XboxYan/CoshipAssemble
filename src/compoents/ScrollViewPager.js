import React, { Component,PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    UIManager,
    LayoutAnimation,
    ScrollView,
    View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Touchable from './Touchable';
import ViewPager from './ViewPager';
import TabAllView from '../pages/TabAllView';


class TabAllbtn extends PureComponent {
    handle = () => {
        const {navigator,tablabel,onSetPage} = this.props;
        navigator.push({
            name: TabAllView,
            tablabel:tablabel,
            onSetPage:onSetPage
        })
    }
    render(){
        return(
            <Touchable onPress={this.handle} style={styles.allbtn}>
                <Icon size={24} name='dashboard' color='#fff' />
            </Touchable>
        )
    }
}

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
    //实际滚动条宽度
    scrollWidth = 0;

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
        if(this.tabsdir[pageIndex]+this.tabswidth[pageIndex]-this.scrollWidth>this.xoffset){
            this.xoffset=this.tabsdir[pageIndex]+this.tabswidth[pageIndex]-this.scrollWidth+30;
            let last = this.tabsdir.length-1;
            let max = this.tabsdir[last]+this.tabswidth[last]-this.scrollWidth;
            this.xoffset=this.xoffset>=max?max:this.xoffset;
            this.tabbar.scrollTo({x: this.xoffset, y: 0, animated: true});
        }else if(this.xoffset>this.tabsdir[pageIndex]){
            this.xoffset=this.tabsdir[pageIndex]-30;
            this.xoffset=this.xoffset>=0?this.xoffset:0;
            this.tabbar.scrollTo({x: this.xoffset, y: 0, animated: true});
        }
        this.setState({pageIndex});
    }

    onSetPage = (pageIndex) => {
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

    scrollayout = (e) => {
        this.scrollWidth = e.nativeEvent.layout.width;
    }

    scrollEnd = (e) => {
        let xoffset = e.nativeEvent.contentOffset.x;
        this.setState({xoffset});
    }
    
    render() {
        const { pageIndex,initialWidth } = this.state;
        const {navigator} = this.props;
        const tablabel = React.Children.map(this.props.children,child=>child.props.tablabel);
        return (
            <View style={styles.container}>
                <View style={styles.scrolltabbar}>
                    <ScrollView
                        onLayout={this.scrollayout}
                        bounces={false}
                        ref={(tabbar) => this.tabbar = tabbar}
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={this.scrollEnd}
                        horizontal={true}
                    >
                        {
                            tablabel.map((item,i)=>(
                                <Touchable onLayout={(e)=>this.onlayout(e,i)} key={i} onPress={()=>{this.onSetPage(i);LayoutAnimation.spring();}} style={styles.tabbaritem}><Text style={styles.tabbartext}>{item}</Text></Touchable>
                            ))
                        }
                        <View style={[styles.tabline, { width:this.tabswidth[pageIndex]||initialWidth,left: this.tabsdir[pageIndex] }]}></View>
                    </ScrollView>
                    {
                        tablabel.length>4?<TabAllbtn navigator={navigator} tablabel={tablabel} onSetPage={this.onSetPage} />:null
                    }
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
        alignItems:'stretch',
        flexDirection:'row'
    },
    tabbaritem: {
        height: 40,
        paddingHorizontal: 15,
        alignItems:'center',
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
    allbtn:{
        width:40,
        height: 40,
        alignItems:'center',
        justifyContent: 'center',
    }
});