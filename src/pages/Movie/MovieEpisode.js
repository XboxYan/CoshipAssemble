import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    FlatList,
    ScrollView,
    UIManager,
    LayoutAnimation,
    InteractionManager,
    Animated,
    TouchableOpacity,
    View,
} from 'react-native';

import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';

import ScrollViewPager from '../../compoents/ScrollViewPager';
import Loading from '../../compoents/Loading';
import Icon from 'react-native-vector-icons/MaterialIcons';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const LoadView = () => (
    <View style={styles.load02}>
        <View style={styles.loaditem}></View>
        <View style={styles.loaditem}></View>
        <View style={styles.loaditem}></View>
        <View style={styles.loaditem}></View>
        <View style={styles.loaditem}></View>
    </View>
)

@observer
class EpisItem extends PureComponent {
    select = ()=>{
        const { item,scrollToIndex } = this.props;
        item.select();
        scrollToIndex(item.name);
    }
    render (){
        const { item } = this.props;
        return (
            <TouchableOpacity onPress={this.select} style={styles.episitem} activeOpacity={.8}>
                <Text style={[styles.episnum, item.selected && styles.episnumActive]}>{item.name + ''}</Text>
            </TouchableOpacity>
        )
    }
}

const EpisList = (props) => (
    <ScrollView style={styles.content} contentContainerStyle={styles.episListwrap} >
        {
            props.data.map((el, i) => (
                <EpisItem scrollToIndex={props.scrollToIndex} item={el} key={i} />
            ))
        }
    </ScrollView>
)

class EpisDetail extends PureComponent {

    state = {
        isRender: false,
    }


    onBack = () => {
        const { navigator } = this.props;
        navigator.pop();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isRender: true,
                //data: tablabels
            })
        })
    }

    render() {
        const { isRender } = this.state;
        const {List,scrollToIndex} = this.props.route;
        return (
            <View style={[styles.conwrap, styles.content, styles.padBottomFix]}>
                <Text style={styles.title}>剧集</Text>
                {
                    isRender ?
                        <ScrollViewPager
                            bgColor='#fff'
                            tabbarHeight={34}
                            tabbarStyle={{ color: '#474747', fontSize: 16 }}
                            tabbarActiveStyle={{ color: $.COLORS.mainColor }}
                            tablineStyle={{ backgroundColor: $.COLORS.mainColor, height: 2 }}
                            tablineHidden={false}>
                            {
                                
                                List.sort.map((el, i) => {
                                    let start = List.sort[i][0].name;
                                    let len = List.sort[i].length;
                                    let end = List.sort[i][len - 1].name;
                                    return <EpisList key={i} data={el} scrollToIndex={scrollToIndex} tablabel={start + '-' + end} />
                                })
                            }
                        </ScrollViewPager>
                        :
                        <Loading />
                }
                <TouchableOpacity onPress={this.onBack} style={styles.slidebtn} activeOpacity={.8}>
                    <Icon name='clear' size={24} color={$.COLORS.subColor} />
                </TouchableOpacity>
            </View>
        )
    }
}

@observer
export default class MovieEpisode extends PureComponent {

    componentDidUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    onShowMore = () => {
        const { navigator,Store } = this.props;
        navigator.push({ name: EpisDetail,List:Store.StoreTv,scrollToIndex:this.scrollToIndex });
    }

    renderItem = ({ item, index }) => {
        return <EpisItem item={item} scrollToIndex={this.scrollToIndex} />
    }


    scrollToIndex = (index) => {
        this.flatlist.getNode().scrollToIndex({ viewPosition: 0.5, index: Number(index)-1 })
    }

    componentDidMount() {
        //const { Store } = this.props;
        //Store.StoreTv.scrollToIndex = this.scrollToIndex;
    }

    render() {
        const { Store } = this.props;
        const StoreTv = Store.StoreTv;
        return (
            <View style={styles.conwrap}>
                <Text style={styles.title}>剧集</Text>
                {
                    Store.isRender&&
                    <AnimatedFlatList
                        ref={(ref) => this.flatlist = ref}
                        style={styles.epislist}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        getItemLayout={(data, index) => ({ length: 70, offset: 70 * index, index })}
                        data={StoreTv.data}
                        renderItem={this.renderItem}
                    />
                }
                <TouchableOpacity disabled={!StoreTv.isRender} onPress={this.onShowMore} style={styles.epistotal} activeOpacity={.8}>
                    <Text style={styles.totaltext}>共{Store.isRender?(StoreTv.length + ''):'0'}集</Text><Icon name='keyboard-arrow-right' size={20} color={$.COLORS.subColor} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    conwrap: {
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec'
    },
    padBottomFix: {
        paddingBottom: 0,
    },
    epislist: {
        paddingHorizontal: 5,
    },
    episListwrap: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 5,
        flexWrap: 'wrap',
    },
    episitem: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    episnum: {
        width:30,
        height:30,
        borderRadius: 15,
        backgroundColor: '#f1f1f1',
        fontSize: 16,
        textAlign:'center',
        justifyContent: 'center',
        alignItems: 'center',
        lineHeight:24,
        color: '#333'
    },
    episnumActive: {
        backgroundColor:$.COLORS.mainColor,
        color: '#fff'
    },
    epistotal: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        height: 48,
        top: 0,
        right: 0
    },
    totaltext: {
        fontSize: 12,
        color: '#9b9b9b',
    },
    title: {
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
        paddingBottom: 10,
    },
    slidebtn: {
        position: 'absolute',
        width: 48,
        height: 48,
        right: 0,
        top: 0,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadview: {
        backgroundColor: '#f1f1f1',
        marginLeft: 10,
    },
    load01: {
        backgroundColor: '#f1f1f1',
        marginLeft: 10,
        borderRadius:12,
        width: 40,
        height: 24,
    },
    load02: {
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    loaditem: {
        width: 30,
        height: 30,
        marginVertical: 10,
        marginHorizontal: 20,
        borderRadius: 15,
        backgroundColor: '#f1f1f1'
    },
})