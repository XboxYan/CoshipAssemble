import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    FlatList,
    ScrollView,
    InteractionManager,
    Animated,
    TouchableOpacity,
    View,
} from 'react-native';

import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';

import ScrollViewPager from './ScrollViewPager';
import Loading from './Loading';
import Icon from 'react-native-vector-icons/MaterialIcons';
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

//影视数据
class List {

    scrollToIndex = ()=>{}

    @observable
    items = [];

    @observable
    current = '1';

    @action
    construct = (data) => {
        let arr = []
        data.forEach((el,i) => arr.push({
            num:i+1,
            key:'key'+i
        }))

        this.items.replace(arr);
    }

    @action
    select = (key) => {
        this.current = key;
        this.scrollToIndex(this.index);
    }

    @action
    chunk = (data, groupByNum) => Array.apply(null, {
        length: Math.ceil(data.length / groupByNum)
    }).map((x, i) => {
        return data.slice(i * groupByNum, (i + 1) * groupByNum);
    })

    @computed
    get index() {
        return this.items.findIndex((el,i)=>el.num==this.current)
    }

    @computed
    get sort() {
        return this.chunk(this.items, 50);
    }

}

const LoadView = () => (
    <View style={styles.conwrap}>
        <View style={styles.load01}></View>
        <View style={styles.load02}>
            <View style={styles.loaditem}></View>
            <View style={styles.loaditem}></View>
            <View style={styles.loaditem}></View>
            <View style={styles.loaditem}></View>
            <View style={styles.loaditem}></View>
        </View>
    </View>
)

const EpisItem = observer((props) => (
    <TouchableOpacity onPress={() => Data.select(props.item.num)} style={styles.episitem} activeOpacity={.8}>
        <Text style={[styles.episnum, Data.current==props.item.num && styles.episnumActive]}>{props.item.num + ''}</Text>
    </TouchableOpacity>
))

const EpisList = (props) => (
    <ScrollView style={styles.content} contentContainerStyle={styles.episListwrap} >
        {
            props.data.map((el, i) => (
                <EpisItem item={el} key={i} />
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
        let data = Data.sort;
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
                                
                                data.map((el, i) => {
                                    let start = data[i][0].num;
                                    let len = data[i].length;
                                    let end = data[i][len - 1].num;
                                    return <EpisList key={i} data={el} tablabel={start + '-' + end} />
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

let Data = new List();

@observer
export default class MovieEpisode extends PureComponent {

    onShowMore = () => {
        const { navigator } = this.props;
        navigator.push({ name: EpisDetail,scrollToIndex:this.scrollToIndex });
    }

    renderItem = ({ item, index }) => {
        return <EpisItem item={item} />
    }


    scrollToIndex = (index) => {
        this.flatlist.getNode().scrollToIndex({ viewPosition: 0.5, index: Number(index) })
    }

    componentDidMount() {
        arr = new Array(142).fill(1);
        Data.construct(arr);
        Data.scrollToIndex = this.scrollToIndex;
        Data.current = '1';
    }

    render() {
        const { isRender } = this.props;
        if (!isRender) {
            return <LoadView />
        }
        return (
            <View style={styles.conwrap}>
                <Text style={styles.title}>剧集</Text>
                <TouchableOpacity onPress={this.onShowMore} style={styles.epistotal} activeOpacity={.8}>
                    <Text style={styles.totaltext}>更新至49集/共{Data.items.length + ''}集</Text><Icon name='keyboard-arrow-right' size={20} color={$.COLORS.subColor} />
                </TouchableOpacity>
                <AnimatedFlatList
                    ref={(ref) => this.flatlist = ref}
                    style={styles.epislist}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    getItemLayout={(data, index) => ({ length: 70, offset: 70 * index, index })}
                    data={Data.items}
                    renderItem={this.renderItem}
                />
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