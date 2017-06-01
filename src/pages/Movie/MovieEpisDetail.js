import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    UIManager,
    InteractionManager,
    TouchableOpacity,
    View,
} from 'react-native';

import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';

import ScrollViewPager from '../../compoents/ScrollViewPager';
import Loading from '../../compoents/Loading';
import Icon from 'react-native-vector-icons/MaterialIcons';

@observer
class EpisItem extends PureComponent {
    render (){
        const { item,isShowPop } = this.props;
        return (
            <TouchableOpacity onPress={item.select} style={styles.episitem} activeOpacity={.8}>
                <View style={[styles.episnum,item.selected && styles.episnumActive]}><Text style={[styles.episnumtxt,isShowPop&&{color:'#9b9b9b'}, item.selected && styles.episnumtxtActive]}>{item.name + ''}</Text></View>
            </TouchableOpacity>
        )
    }
}

const EpisList = (props) => (
    <ScrollView style={styles.content} contentContainerStyle={styles.episListwrap} >
        {
            props.data.map((el, i) => (
                <EpisItem isShowPop={props.isShowPop} item={el} key={i} />
            ))
        }
    </ScrollView>
)

export default class EpisDetail extends PureComponent {

    state = {
        isRender: false,
    }


    onBack = () => {
        const { navigator,onClose } = this.props;
        navigator&&navigator.pop();
        onClose&&onClose();
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
        const { Store } = this.props.route;
        const { isShowPop } = Store;
        const List = Store.StoreTv.sort;
        return (
            <View style={[styles.conwrap,isShowPop&&styles.popContent]}>
                <Text style={[styles.title,isShowPop&&styles.popTitle]}>剧集</Text>
                {
                    (isRender&&Store.StoreTv.isRender) ?
                    <View style={styles.content}>
                        <ScrollViewPager
                            tabbarHeight={34}
                            hideBorder={isShowPop}
                            tabbarStyle={isShowPop?styles.popTabbarStyle:styles.tabbarStyle}
                            tabbarActiveStyle={{ color: $.COLORS.mainColor }}
                            tablineStyle={{ backgroundColor: $.COLORS.mainColor, height: 2 }}
                            tablineHidden={false}>
                            {
                                
                                List.map((el, i) => {
                                    let start = List[i][0].name;
                                    let len = List[i].length;
                                    let end = List[i][len - 1].name;
                                    return <EpisList key={i} data={el} isShowPop={isShowPop} tablabel={start + '-' + end} />
                                })
                            }
                        </ScrollViewPager>
                        </View>
                        :
                        <Loading text='剧集加载中...' textColor={isShowPop?'#9b9b9b':'#666'} />
                }
                <TouchableOpacity onPress={this.onBack} style={styles.slidebtn} activeOpacity={.8}>
                    <Icon name='clear' size={24} color={$.COLORS.subColor} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content:{
        flex: 1,
    },
    conwrap: {
        flex: 1,
        paddingTop: 20,
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec'
    },
    popContent: {
        backgroundColor: 'rgba(0,0,0,.75)',
        paddingHorizontal:100,
        borderTopWidth:0
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
        width:40,
        height:40,
        borderRadius: 20,
        textAlign:'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    episnumtxt:{
        fontSize: 18,
        color: '#333'
    },
    episnumActive: {
        backgroundColor:$.COLORS.mainColor,
    },
    episnumtxtActive:{
        color: '#fff'
    },
    title: {
        paddingHorizontal: 10,
        fontSize: 16,
        color: '#333',
        paddingBottom: 10,
    },
    popTitle:{
        color:'#fff',
        textAlign:'center'
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
    tabbarStyle:{
        color: '#474747', 
        fontSize: 16
    },
    popTabbarStyle:{
        fontSize: 16,
        color: '#9b9b9b', 
    }
})