import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    UIManager,
    LayoutAnimation,
    ScrollView,
    TouchableOpacity,
    View,
} from 'react-native';

import Image from '../../compoents/Image';
import { observer } from 'mobx-react/native';

const LoadView = () => (
    <View style={styles.load02}>
        <View style={styles.loaditem}>
            <View style={styles.loadHead}></View>
            <View style={styles.loadName}></View>
        </View>
        <View style={styles.loaditem}>
            <View style={styles.loadHead}></View>
            <View style={styles.loadName}></View>
        </View>
        <View style={styles.loaditem}>
            <View style={styles.loadHead}></View>
            <View style={styles.loadName}></View>
        </View>
    </View>
)

@observer
class MovieItem extends PureComponent {
    handle = () => {
        const { Store, item, scrollToTop } = this.props;
        scrollToTop();
        Store.setId(item.assetId);
    }
    render() {
        const { item } = this.props;
        return (
            <TouchableOpacity onPress={this.handle} style={styles.movieitem} activeOpacity={.8}>
                <View style={styles.imgwrap}>
                    <Image 
                        style={styles.img} 
                        source={{uri:Base+(item.imageList.length>0?item.imageList[0].posterUrl:'')}}
                        defaultSource={require('../../../img/poster_moren.png')} 
                    />
                </View>
                <Text numberOfLines={1} style={styles.name}>{item.titleBrief}</Text>
            </TouchableOpacity>
        )
    }
}

@observer
export default class extends PureComponent {

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentWillUpdate() {
        //LayoutAnimation.spring();
    }

    render() {
        const { Store, scrollToTop } = this.props;
        const isRender = Store.isRender && Store.StoreRecom.isRender;
        return (
            <View style={styles.conwrap}>
                <Text style={styles.title}>相关推荐</Text>
                {
                    isRender ?
                        <ScrollView
                            horizontal={true}
                            contentContainerStyle={{ paddingHorizontal: 5 }}
                            showsHorizontalScrollIndicator={false}>
                            {
                                Store.StoreRecom.data.map((el, i) => (
                                    <MovieItem key={el.assetId} item={el} Store={Store} scrollToTop={scrollToTop} />
                                ))
                            }
                        </ScrollView>
                        :
                        <LoadView/>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    conwrap: {
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec'
    },
    title: {
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
        paddingBottom: 10,
    },
    movieitem: {
        width: 100,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    imgwrap: {
        width: 100,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        overflow: 'hidden'
    },
    img: {
        width: '100%',
        flex: 1,
        resizeMode: 'cover',
    },
    name: {
        fontSize: 14,
        color: '#333',
        paddingTop: 12
    },
    loadview: {
        backgroundColor: '#f1f1f1',
        marginLeft: 10,
    },
    load01: {
        backgroundColor: '#f1f1f1',
        marginLeft: 10,
        borderRadius: 12,
        width: 40,
        height: 24,
        marginBottom: 10
    },
    load02: {
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    loaditem: {
        width: 100,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    loadHead: {
        width: 100,
        height: 140,
        backgroundColor: '#f1f1f1',
    },
    loadName: {
        height: 20,
        width: 70,
        backgroundColor: '#f1f1f1',
        marginTop: 14
    }
})