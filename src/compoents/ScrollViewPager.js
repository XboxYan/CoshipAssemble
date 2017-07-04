import React, { PropTypes,PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    UIManager,
    LayoutAnimation,
    InteractionManager,
    ScrollView,
    Image,
    TouchableOpacity,
    View,
} from 'react-native';

import ViewPager from './ViewPager';
import Touchable from './Touchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Appbar from './Appbar';
import Loading from './Loading';

class GridItem extends PureComponent {
    handle = () => {
        const {navigator,onSetPage,pageIndex} = this.props;
        navigator.pop();
        onSetPage(pageIndex);
    }
    render(){
        const {title} = this.props;
        return(
            <Touchable onPress={this.handle} style={styles.griditem}>
                <Icon size={30} name='dashboard' color={$.COLORS.mainColor} />
                <Text numberOfLines={1} style={styles.gridtext}>{title}</Text>
            </Touchable>
        )
    }
}

class TabAllView extends PureComponent {
    state = {
        isRender:false,
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isRender:true
            })
        })
    }
    render(){
        const {navigator,route}=this.props;
        const {isRender}=this.state;
        return (
            <View style={styles.container}>
                <Appbar title="分类" navigator={navigator} />
                {
                    true?
                    <ScrollView style={styles.content}>
                        <View style={styles.gridcon}>
                        {
                            route.tablabel.map((el,i)=>(
                                <GridItem key={i} navigator={navigator} onSetPage={route.onSetPage} pageIndex={i} title={el} />
                            ))
                        }
                        </View>
                    </ScrollView>
                    :
                    <Loading />
                }
                
            </View>
        )
    }
}

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
    static PropTypes = {
        isShowMore:PropTypes.bool,
        pageIndex:PropTypes.num
    }

    static defaultProps = {
        isShowMore:true,
        pageIndex:0
    }
    constructor(props) {
        super(props);
        this.state = {
            pageIndex: props.pageIndex,
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
        if(this.props.pageIndex!=0){
            this.xScroll(this.props.pageIndex);
        }
    }

    scrollayout = (e) => {
        this.scrollWidth = e.nativeEvent.layout.width;
        this.tabbar.scrollTo({x: this.xoffset, animated: false});
    }

    scrollEnd = (e) => {
        this.xoffset = e.nativeEvent.contentOffset.x;
    }
    
    render() {
        const { pageIndex,initialWidth } = this.state;
        const {navigator,bgColor,hideBorder,tabbarHeight,tabbarStyle,tablineStyle,tabbarActiveStyle,tablineHidden,isShowMore} = this.props;
        const tablabel = React.Children.map(this.props.children,child=>child.props.tablabel);
        return (
            <View style={{flex:1}}>
                <View style={[styles.scrolltabbar,{backgroundColor:bgColor},hideBorder&&{borderBottomWidth:0}]}>
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
                                <Touchable onLayout={(e)=>this.onlayout(e,i)} key={i} onPress={()=>{this.onSetPage(i)}} style={[styles.tabbaritem,{height:tabbarHeight}]}><Text numberOfLines={2} style={[styles.tabbartext,tabbarStyle,(pageIndex===i)&&tabbarActiveStyle]}>{item}</Text></Touchable>
                            ))
                        }
                        {
                            !tablineHidden&&<View style={[styles.tabline,tablineStyle, { width:this.tabswidth[pageIndex]||initialWidth,left: this.tabsdir[pageIndex] }]}></View>
                        }
                    </ScrollView>
                    {
                        (tablabel.length>4&&isShowMore)?<TabAllbtn navigator={navigator} tablabel={tablabel} onSetPage={this.onSetPage} />:null
                    }
                </View>
                <ViewPager
                    ref={(viewpager) => this.viewpager = viewpager}
                    onPageSelected={this.onPageSelected}
                    initialPage={pageIndex}
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
        backgroundColor:'#fff'
    },
    scrolltabbar: {
        alignItems:'stretch',
        flexDirection:'row',
        borderBottomWidth:1/$.PixelRatio,
        borderBottomColor:'#ececec',
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
        textAlign:'center',
        color: '#fff'
    },
    allbtn:{
        width:32,
        height:32,
        alignItems:'center',
        justifyContent: 'center',
        marginRight:9
    },
    gridcon:{
        backgroundColor:'#fff',
        flexDirection:'row',
        flexWrap:'wrap',
        marginTop:10
    },
    griditem:{
        width:$.WIDTH/3,
        height:$.WIDTH/4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal:5
    },
    gridtext:{
        color:'#999',
        fontSize:14,
        marginTop:5
    }
});