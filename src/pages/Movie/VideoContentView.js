import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    Image,
    Share,
    ScrollView,
    Navigator,
    ToastAndroid,
    UIManager,
    LayoutAnimation,
    TouchableOpacity,
    InteractionManager,
    View,
} from 'react-native';

import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';

import Appbar from '../../compoents/Appbar';
import Video from '../../compoents/Video';
import MovieCasts from './MovieCasts';
import MovieInfo from './MovieInfo';
import MovieRecom from './MovieRecom';
import MovieEpisode from './MovieEpisode';
import MovieComment from './MovieComment';
import fetchData from '../../util/Fetch';

class StoreVideo {

    @observable
    playUri = Base;
    //playUri = 'http://10.9.219.22:8099/vod/201003170038,TWSX1463723577361554.m3u8';

    @observable
    isRender = false;

    constructor(assetId,TVassetId) {
        const id = TVassetId?TVassetId:assetId;
        this._fetchData(id); 
        
    }

    _fetchData = (assetId) => {
        
        fetchData('getPlayURL',{
            headers:{'Content-Type': 'application/json'},
            par:{
                assetId:assetId
            }
        },(data)=>{
            if(data.ret==='0'){
                this.isRender = true;
                this.playUri = data.palyURL.split('?')[0];
                ToastAndroid.show(this.playUri, ToastAndroid.SHORT);
            }else{
                assetId&&ToastAndroid.show('播放串获取失败!', ToastAndroid.SHORT);
            }
        })
    }

}

class StoreRecom {

    @observable
    data = [];

    @observable
    isRender = false;

    constructor(assetId) {
        this._fetchData(assetId);
    }

    _fetchData = (assetId) => {
        fetchData('GetAssociatedFolderContents',{
            par:{
                quickId:assetId,
                targetLabel:'A',
                associatedType:'1'
            }
        },(data)=>{
            if(data.totalResults>0){
                this.isRender = true;
                this.data = data.selectableItem;
            }
        })
    }
}

class StoreInfo {

    @observable
    data = [];

    @observable
    isRender = false;

    constructor(assetId,store) {
        this._fetchData(assetId,store);
    }

    _fetchData = (assetId,store) => {
        fetchData('GetItemData',{
            par:{
                titleAssetId:assetId
            }
        },(data)=>{
            this.data = data.selectableItem;
            store.isTV&&store.setTVList(data.selectableItem);
            this.isRender = true;
        })
    }
}

class TvItem {
    name = '';
    key = '';
    list = null;

    constructor(Item,list){
        const {chapter,assetId,titleFull} = Item;
        this.name = chapter;
        this.key = assetId;
        this.title = titleFull;
        this.list = list;
    }

    @computed
    get selected(){
        return this.list.selectedIndex === Number(this.name);
    }

    @action
    select = () => {
        this.list.selectedIndex = Number(this.name);
        this.list.Store.TVassetId = this.key;
        //this.list.scrollToIndex(this.name);
    }
}

class StoreTv {

    Store = null

    @observable
    data = [];

    @observable
    isRender = false;

    @observable
    selectedIndex = 1;

    @computed
    get selectedItem(){
        return this.length?this.data[this.selectedIndex-1]:null;
    }

    @action
    chunk = (data, groupByNum) => Array.apply(null, {
        length: Math.ceil(data.length / groupByNum)
    }).map((x, i) => {
        return data.slice(i * groupByNum, (i + 1) * groupByNum);
    })

    @computed
    get sort() {
        return this.chunk(this.data, 30);
    }

    @computed
    get length() {
        return this.data.length;
    }

    constructor(obj,store) {
        this.Store = store;
        this._fetchData(obj);
    }

    _fetchData = (obj) => {
        const {assetId,providerId,folderAssetId} = obj;
        fetchData('GetFolderContents',{
            par:{
                folderAssetId:folderAssetId,
                titleProviderId:providerId,
                assetId:assetId,
                maxItems:'',
                includeSelectableItem:'Y'
            }
        },(data)=>{
            const ItemList = data.selectableItemList||[];
            //this.data = [ for (Item of ItemList) new TvItem(Item,this) ];
            this.data = ItemList.map(item=>new TvItem(item,this));
            this.isRender = true;
        })
    }
}

class Store {
    @observable
    assetId = '';

    @observable
    TVassetId = '';

    @observable
    isRender = false;

    @observable
    isTV = false;

    @observable
    TVList = {};

    @computed
    get StoreVideo(){
        return new StoreVideo(this.assetId,this.TVassetId);
    }

    @computed
    get StoreRecom(){
        return new StoreRecom(this.assetId);
    }

    @computed
    get StoreInfo(){
        return new StoreInfo(this.assetId,this);
    }

    @computed
    get StoreTv(){
        return this.isTV?new StoreTv(this.TVList,this):[]
    }

    @action
    setId = (assetId) => {
        this.assetId = assetId;
    }

    @action
    isRendered = () => {
        this.isRender = true;
    }

    @action
    setTV = (bool) => {
        this.isTV = bool;
    }

    @action
    setTVList = (obj) => {
        this.TVList = obj;
    }



}

@observer
class VideoInfo extends PureComponent {
    
    data = [1,1,1,1,11,1,1];

    commentPosY = 0;

    onCommentLayout = (e) => {
        let {y} = e.nativeEvent.layout;
        this.commentPosY = y;
    }
    onScrollToComment = () => {
        this.scrollview.scrollTo({y:this.commentPosY,animated: true})
    }

    scrollToTop = () => {
        this.scrollview.scrollTo({y:0,animated: true})
    }

    render() {
        const {navigator,Store,item} = this.props;
        return (
            <ScrollView ref={(scrollview)=>this.scrollview=scrollview} style={styles.content}>
                <MovieInfo Store={Store} navigator={navigator} onScrollToComment={this.onScrollToComment} />
                {
                    //<MovieCasts isRender={Store.isRender} data={this.data} />
                }
                {
                    Store.isTV&&<MovieEpisode Store={Store} navigator={navigator} />
                }
                <MovieRecom Store={Store} scrollToTop={this.scrollToTop} />
                <MovieComment isRender={Store.isRender} onCommentLayout={this.onCommentLayout} />
            </ScrollView>
        )
    }
}

@observer
export default class extends PureComponent {

    Store = new Store();

    constructor(props) {
        super(props);
        this.state = {
            isRender: false,
            layoutTop: 0,
            playUri:''
        }
        //处理安卓Back键
        const { navigator } = this.props;
        const routers = navigator.getCurrentRoutes();
        const top = routers[routers.length - 1];
        top.handleBack = this.handleBack;
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentWillUpdate(nextProps,nextState){
        //LayoutAnimation.spring();
    }

    handleBack = () => {
        if (this.video&&this.video.isFull) {
            this.video.setFullScreen();
        } else {
            const navigator = this.navigator;
            const routers = navigator.getCurrentRoutes();
            if(routers.length>1){
                navigator.pop();
            }else{
                this.video&&this.video.onPause();
                this.props.navigator.pop();
            }
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const item = this.props.route.item;
            const isTV = item.isPackage==='1';
            this.Store.setId(item.assetId);
            this.Store.isRendered();
            this.Store.setTV(isTV);
        })
    }
    onLayout = (e) => {
        let { y } = e.nativeEvent.layout;
        this.setState({
            layoutTop: y + $.STATUS_HEIGHT
        })
    }
    renderScene = (route, navigator) => {
        let Component = route.name;
        return (
            <Component navigator={navigator} item={this.props.route.item} Store={this.Store} route={route} />
        );
    }
    render() {
        const { navigator, route } = this.props;
        const { layoutTop } = this.state;
        const StoreVideo = this.Store.StoreVideo;
        return (
            <View style={styles.content}>
                <StatusBar barStyle='light-content' backgroundColor='transparent' />
                <View onLayout={this.onLayout} style={styles.videoCon}></View>
                {
                    (this.Store.isRender) && <Video ref={(ref) => { this.video = ref }} handleBack={this.handleBack} playUri={StoreVideo.playUri} style={{ top: layoutTop }} />
                }
                <Navigator
                    ref={(nav) => this.navigator = nav}
                    sceneStyle={{ flex: 1,backgroundColor:'#fff' }}
                    initialRoute={{ name: VideoInfo }}
                    configureScene={(route) => Object.assign(Navigator.SceneConfigs.FloatFromBottomAndroid)}
                    renderScene={this.renderScene}
                />
            </View>

        )
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1
    },
    videoCon: {
        height: $.WIDTH * 9 / 16 + $.STATUS_HEIGHT,
        paddingTop: $.STATUS_HEIGHT,
        backgroundColor: '#000'
    }
})