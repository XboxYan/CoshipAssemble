import React, { Component,PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    UIManager,
    LayoutAnimation,
    ScrollView,
    Image,
    TouchableOpacity,
    View,
} from 'react-native';

import ViewPager from './ViewPager';
import TabAllView from '../pages/TabAllView';
import Touchable from './Touchable';

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
            <TouchableOpacity activeOpacity={.8} onPress={this.handle} style={styles.allbtn}>
                <Image style={{width:24,height:24}} source={require('../../img/icon_more.png')} />
            </TouchableOpacity>
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
        this.setState({pageIndex});
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
        this.xoffset = e.nativeEvent.contentOffset.x;
    }
    
    render() {
        const { pageIndex,initialWidth } = this.state;
        const {navigator,bgColor,tabbarHeight,tabbarStyle,tablineStyle,tabbarActiveStyle,tablineHidden} = this.props;
        const tablabel = React.Children.map(this.props.children,child=>child.props.tablabel);
        return (
            <View style={styles.container}>
                <View style={[styles.scrolltabbar,{backgroundColor:bgColor}]}>
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
                                <Touchable onLayout={(e)=>this.onlayout(e,i)} key={i} onPress={()=>{this.onSetPage(i);LayoutAnimation.spring();}} style={[styles.tabbaritem,{height:tabbarHeight}]}><Text style={[styles.tabbartext,tabbarStyle,(pageIndex===i)&&tabbarActiveStyle]}>{item}</Text></Touchable>
                            ))
                        }
                        {
                            !tablineHidden&&<View style={[styles.tabline,tablineStyle, { width:this.tabswidth[pageIndex]||initialWidth,left: this.tabsdir[pageIndex] }]}></View>
                        }
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
        paddingHorizontal: 15,
        alignItems:'center',
        justifyContent: 'center',
    },
    tabline: {
        height: 3,
        borderRadius: 1,
        width: 0,
        position: 'absolute',
        bottom: 0,
        left:-100,
        backgroundColor: '#fff',
    },
    tabbartext: {
        fontSize: 14,
        opacity: 1,
        color: '#fff'
    },
    allbtn:{
        width:32,
        height:32,
        alignItems:'center',
        justifyContent: 'center',
        marginRight:9
    }
});