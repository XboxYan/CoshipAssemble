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
        </View>
    </View>
)

const CastItem = (props) => (
    <TouchableOpacity style={styles.cast} activeOpacity={.8}>
        <View style={styles.head}>
            <Image 
                style={styles.headImage} 
                source={{uri:Base+props.cast.actorImageURL}}
                defaultSource={require('../../../img/actor_moren.png')} 
            />
        </View>
        <Text numberOfLines={1} style={styles.castname}>{props.cast.name}</Text>
    </TouchableOpacity>
)

@observer
export default class extends PureComponent {
    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }
    render() {
        const { Store } = this.props;
        const {StoreInfo} = Store;
        const isRender = Store.isRender&&StoreInfo.isRender;
        return (
            <View style={styles.conwrap}>
                <Text style={styles.title}>明星</Text>
                {
                    isRender?
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        {
                            StoreInfo.castList.map((el, i) => (
                                <CastItem key={i} cast={el} />
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
        borderTopColor: '#ececec',
    },
    conHorizon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
        paddingBottom: 10,
    },
    cast: {
        width: 80,
        paddingTop: 10,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    head: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        overflow: 'hidden'
    },
    headImage: {
        width: 56,
        height: 56,
        resizeMode: 'cover',
        borderRadius: 28,
    },
    castname: {
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
    },
    load02: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loaditem: {
        width: 80,
        paddingTop: 10,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    loadHead: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#f1f1f1',
    },
    loadName: {
        height: 20,
        width: 50,
        borderRadius: 10,
        backgroundColor: '#f1f1f1',
        marginTop: 14
    }
})