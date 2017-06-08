import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    FlatList,
    LayoutAnimation,
    Animated,
    TouchableOpacity,
    View,
} from 'react-native';

import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';

import Loading from '../../compoents/Loading';
import EpisDetail from './MovieEpisDetail';
import Icon from 'react-native-vector-icons/MaterialIcons';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const LoadView = () => (
    <View style={styles.load02}>
        <View style={styles.loaditem}></View>
    </View>
)

@observer
class EpisItem extends PureComponent {
    render (){
        const { item } = this.props;
        return (
            <TouchableOpacity onPress={item.select} style={styles.episitem} activeOpacity={.8}>
                <View style={[styles.episnum,item.selected && styles.episnumActive]}><Text style={[styles.episnumtxt, item.selected && styles.episnumtxtActive]}>{item.name + ''}</Text></View>
            </TouchableOpacity>
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
        navigator.push({ name: EpisDetail,Store:Store });
    }

    renderItem = ({ item, index }) => {
        return <EpisItem item={item} />
    }


    scrollToIndex = (index) => {
        this.flatlist.getNode().scrollToIndex({ viewPosition: 0.5, index: Number(index)-1 })
    }

    componentDidMount() {
        const { Store } = this.props;
        Store.scrollToIndex = this.scrollToIndex;
    }

    render() {
        const { Store } = this.props;
        const { StoreTv,StoreInfo } = Store;
        const isRender = StoreTv.isRender&&StoreInfo.isRender;
        return (
            <View style={styles.conwrap}>
                <Text style={styles.title}>剧集</Text>
                {
                    isRender
                    ?
                    <AnimatedFlatList
                        ref={(ref) => this.flatlist = ref}
                        style={styles.epislist}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        getItemLayout={(data, index) => ({ length: 70, offset: 70 * index, index })}
                        data={StoreTv.data}
                        renderItem={this.renderItem}
                    />
                    :
                    <LoadView/>
                }
                <TouchableOpacity disabled={!isRender} onPress={this.onShowMore} style={styles.epistotal} activeOpacity={.8}>
                    <Text style={styles.totaltext}>共{isRender?(StoreTv.length + ''):'0'}集</Text><Icon name='keyboard-arrow-right' size={20} color={$.COLORS.subColor} />
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    episnumtxt:{
        fontSize: 16,
        color: '#333'
    },
    episnumActive: {
        backgroundColor:$.COLORS.mainColor,
    },
    episnumtxtActive:{
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