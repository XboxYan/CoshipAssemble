import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    Image,
    ScrollView,
    FlatList,
    UIManager,
    LayoutAnimation,
    InteractionManager,
    View,
} from 'react-native';
import {observable, action, computed} from 'mobx';
import {observer} from 'mobx-react/native';

import VrPlayView from './VrPlayView'

import Loading from '../../compoents/Loading';
import ScrollViewPager from '../../compoents/ScrollViewPager';
import Touchable from '../../compoents/Touchable';
import Appbar from '../../compoents/Appbar';

const vrMark = require('../../../img/icon_vr_mark.png');

@observer
class VrListItem extends PureComponent {
    constructor(props){
        super(props)
    }

    toVrPlayView = () => {
        const {navigator, item} = this.props;
        navigator.push({
            name: VrPlayView,
            resourceName: item.title,
            resourceId: item.id
        })
    }

    render() {

        const {item} = this.props;

        return (
            <View style={styles.vrListItemContainer}>
                <Touchable style={styles.itemPosterContainer} onPress={this.toVrPlayView}>
                    <Image source={{uri: item.titlePic}} style={styles.itemPoster}/>
                    <Image source={vrMark} style={styles.vrMark}/>
                </Touchable>
                <View style={styles.itemRowTextContainer}>
                    <Text style={styles.itemText}>{item.title}</Text>
                    <Text style={[styles.itemText, {flex: 1, marginRight: 5, textAlign: 'right'}]}>{item.region}</Text>
                </View>
                <Text style={[styles.itemText, {color: '#9B9B9B', marginBottom: 12}]}>{item.desc}</Text>
            </View>
        )
    }
}

@observer
class VrList extends PureComponent {
    @observable vrList = null;
    @observable isRefresh = false;

    @computed get isRender() {
        return this.vrList != null;
    }

    componentDidMount() {
        this._loadVrResources();
    }

    @action
    _loadVrResources = () => {
        this.isRefresh = true;
        const {column} = this.props;

        fetch("http://10.9.216.1:8000/SPSmartCMS/json/content_list.jspx?channelIds[]=" + column.id)
            .then((response) => {
                return response.json()
            })
            .then((data) => {

                InteractionManager.runAfterInteractions(() => {
                    let i = 0;
                    let datas = [];
                    data.map((info) => {
                        let itemData = {
                            id: info.id,
                            title: info.title,
                            titlePic: info.attr.titlePic,
                            region:info.attr.zone,
                            desc:info.description
                        };

                        datas.push({
                                key: i,
                                value:itemData
                            }
                        );

                        i++;
                    });

                    this.vrList=datas;

                    this.isRefresh = false;
                })
            })
            .catch((error) => {
                console.warn(error);
            })
    }

    renderItem = (item) => {
        const {navigator} = this.props;
        //console.log(item.item.value.title)
        return (<VrListItem key={item.item.key} item={item.item.value} navigator={navigator}/>)
    }
    separator = () => {
        return <View style={{height: 1, backgroundColor: '#f0f0f1'}}/>;
    }

    render() {
        return (
            this.isRender ?
                <FlatList
                    style={styles.vrListContainer}
                    onRefresh={this._loadVrResources}
                    refreshing={this.isRefresh}
                    ItemSeparatorComponent={this.separator}
                    data={this.vrList}
                    renderItem={this.renderItem}/>
                :
                <Loading/>
        );
    }
}

@observer
export default class extends PureComponent {
    @observable vrColumns = null;

    @computed get isRender() {
        return this.vrColumns != null;
    }

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    @action
    componentDidMount() {
        fetch("http://10.9.216.1:8000/SPSmartCMS/json/channel_list.jspx?parentId=555&hasContentOnly=false&first=0&count=10")
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                InteractionManager.runAfterInteractions(() => {
                    this.vrColumns = data;
                })
            })
            .catch((error) => {
                console.warn(error);
            })
    }

    render() {
        const {navigator} = this.props;
        return (
            <View style={{flex: 1}}>
                <Appbar title="VR全景" navigator={navigator}/>
                {
                    this.isRender ?
                        <ScrollViewPager
                            bgColor='#fff'
                            tabbarHeight={34}
                            tabbarStyle={{color: '#474747', fontSize: 16}}
                            tabbarActiveStyle={{color: $.COLORS.mainColor}}
                            tablineStyle={{backgroundColor: $.COLORS.mainColor, height: 2}}
                            tablineHidden={false}
                            navigator={navigator}>
                            {
                                this.vrColumns.map((item) => <VrList key={item.id}
                                                                     column={item}
                                                                     navigator={navigator}
                                                                     tablabel={item.name}/>)
                            }
                        </ScrollViewPager>
                        :
                        <Loading/>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    vrListItemContainer: {
        width: 324,
        height: 216,
        justifyContent: 'center',
        marginHorizontal: 18,
        marginTop: 10
    },
    itemPosterContainer: {
        width: 323,
        height: 170
    },
    itemPoster: {
        width: 324,
        height: 170,
        resizeMode: 'stretch'
    },
    itemRowTextContainer: {
        width: 324,
        height: 13,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemText: {
        fontSize: 13,
        color: '#474747'
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    vrListContainer: {
        width: $.WIDTH
    },
    vrMark: {
        width: 40,
        height: 40,
        position: 'absolute',
        left: 142,
        top: 65,
        zIndex: 10
    },
    columnText: {
        fontSize: 16,
        textAlign: 'center'
    },
    tabBarUnderline: {
        backgroundColor: '#4aa3fe'
    }
})