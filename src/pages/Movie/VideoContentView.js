import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    Image,
    Modal,
    Share,
    ScrollView,
    Navigator,
    UIManager,
    LayoutAnimation,
    TouchableOpacity,
    InteractionManager,
    View,
} from 'react-native';

import Toast from 'react-native-root-toast';

import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import moment from 'moment';
import LoginStore from '../../util/LoginStore';

import Appbar from '../../compoents/Appbar';
import Video from '../../compoents/Video';
import Touchable from '../../compoents/Touchable';
import MovieCasts from './MovieCasts';
import MovieInfo from './MovieInfo';
import MovieRecom from './MovieRecom';
import MovieEpisode from './MovieEpisode';
import MovieComment from './MovieComment';
import fetchData from '../../util/Fetch';
import EpisDetail from './MovieEpisDetail';

class StoreVideo {

    @observable
    //playUri = Base;
    playUri = null;

    @observable
    isRender = false;

    constructor(assetId,TVassetId) {
        if(TVassetId){
            assetId&&TVassetId&&this._fetchData(TVassetId);
        }else{
            assetId&&this._fetchData(assetId);
        }
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
                this.playUri = data.palyURL;
                //Toast.show(this.playUri);
            }else{
                Toast.show('播放串获取失败!');
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
        assetId&&this._fetchData(assetId);
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

    @computed
    get castList(){
        return this.data.actor;
    }

    @computed
    get hasCollect(){
        return this.data.hasCollect==='1';
    }

    @computed
    get providerId(){
        return this.data.providerId;
    }

    @observable
    isRender = false;

    constructor(assetId,store) {
        assetId&&this._fetchData(assetId,store);
    }

    _fetchData = (assetId,store) => {
        fetchData('GetItemData',{
            par:{
                titleAssetId:assetId
            }
        },(data)=>{
            const item = data.selectableItem;
            this.data = item;
            store.setTVList(item);
            this.isRender = true;
        })
    }
}

class TvItem {
    name = '';
    key = '';
    list = null;
    title = '';
    providerId = '';

    constructor(Item,list){
        const {chapter,assetId,titleFull,providerId} = Item;
        this.name = chapter;
        this.key = assetId;
        this.providerId = providerId;
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
        this.list.Store.scrollToIndex(this.name);
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

    @computed
    get providerId(){
        return this.selectedItem?this.selectedItem.providerId:'';
    }

    @action
    next = () => {
        if(this.selectedIndex<this.length){
            Toast.show('正准备播放下一集~');
            this.selectedIndex+=1;
            this.Store.scrollToIndex(this.selectedItem.name);
            this.Store.TVassetId = this.selectedItem.key;
        }else{
            Toast.show('所有剧集播放完毕~');
        }      
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
        obj.assetId&&this._fetchData(obj);
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
            if(data.selectableItemList.length>0){
                const ItemList = data.selectableItemList;
                //this.data = [ for (Item of ItemList) new TvItem(Item,this) ];
                this.data = ItemList.map(item=>new TvItem(item,this));
                this.Store.TVassetId = ItemList[0].assetId;
                this.isRender = true;
            }
        })
    }
}

class StoreCollect {

    titleAssetId = '';

    @observable
    isCollected = false;

    constructor(assetId,hasCollect) {
        this.titleAssetId = assetId;
        this.isCollected = hasCollect;
    }

    @action
    AddBookmark = () => {
        fetchData('AddBookmark',{
            par:{
                titleAssetId:this.titleAssetId,
            }
        },(data)=>{
            if(data.bookmarkedId==='0'){
                this.isCollected = true;
                Toast.show('收藏成功!');
            }
        })
    }

    @action
    DeleteBookmark = () => {
        fetchData('DeleteBookmark',{
            par:{
                titleAssetId:this.titleAssetId,
            }
        },(data)=>{
            if(data.code==='0'){
                this.isCollected = false;
                Toast.show('取消收藏成功!');
            }
        })
    }

}

class StoreComment {

    objID = '';

    providerId = '';

    @observable
    data = [];

    @observable
    isRender = false;

    @observable
    size = 0;

    constructor(assetId,TVassetId,providerId) {
        this.providerId = providerId;
        if(TVassetId){
            TVassetId&&providerId&&this._fetchData(TVassetId);
            this.objID = TVassetId;
        }else{
            assetId&&providerId&&this._fetchData(assetId);
            this.objID = assetId;
        }
    }

    _fetchData = (objID) => {
        fetchData('GetComments',{
            par:{
                objID,
                providerId:this.providerId,
            }
        },(data)=>{
            if(data.ret==='0'){
                this.isRender = true;
                this.size = Number(data.totolCount);
                this.data = data.commitList;
            }
        })
    }

    @action
    addComment = (comment) => {
        fetchData('UserComment',{
            par:{
                objID:this.objID,
                providerId:this.providerId,
                comment
            }
        },(data)=>{
            if(data.code==='0'){
                Toast.show('评论成功~');
                this.size += 1;
                this.data = [{
                    "comment": comment,
                    "objID":moment().format("YYYY-MM-DD H:mm:ss"),
                    "creatTime":moment().format("YYYY-MM-DD H:mm:ss"),
                    "logo":LoginStore.userInfo.logo,
                    "userName":LoginStore.userInfo.nickName||LoginStore.userCode
                },...this.data]
            }else{
                Toast.show(data.message);
            }
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
    TVList = {};

    @observable
    isShowPop = false;

    @observable
    scrollToIndex = ()=>{};

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
        return new StoreTv(this.TVList,this);
    }

    @computed
    get StoreComment(){
        return new StoreComment(this.assetId,this.TVassetId,this.StoreTv.providerId||this.StoreInfo.providerId);
    }

    @computed
    get StoreCollect(){
        return new StoreCollect(this.assetId,this.StoreInfo.hasCollect);
    }

    @computed
    get isTV(){
        return this.StoreInfo.data.isPackage === '1';
    }

    @computed
    get title(){
        const isRender = this.isRender&&this.StoreInfo.isRender;
        return isRender?(this.isTV&&this.StoreTv.isRender?this.StoreTv.selectedItem.title:this.StoreInfo.data.titleFull):'加载中...'
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
    setTVList = (obj) => {
        this.TVList = obj;
    }

    @action
    setModalVisible = (bool) => {
        this.isShowPop = bool;
    }
}

@observer
class VideoInfo extends PureComponent {

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
        const {navigator,Navigator,Store,item} = this.props;
        return (
            <ScrollView ref={(scrollview)=>this.scrollview=scrollview} style={styles.content}>
                <MovieInfo Store={Store} navigator={navigator} Navigator={Navigator} onScrollToComment={this.onScrollToComment} />
                <MovieCasts Store={Store} />
                {
                    Store.isTV&&<MovieEpisode Store={Store} navigator={navigator} />
                }
                <MovieRecom Store={Store} scrollToTop={this.scrollToTop} />
                <MovieComment Store={Store} navigator={navigator} Navigator={Navigator} onCommentLayout={this.onCommentLayout} />
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
            layoutTop: 0,
            modalVisible:false
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
        const item = this.props.route.item;
        InteractionManager.runAfterInteractions(() => {
            this.Store.setId(item.assetId);
            this.Store.isRendered();
        })
    }

    setModalShow = () => {
        this.Store.setModalVisible(true);
    }

    setModalHide = () => {
        this.Store.setModalVisible(false);
    }

    renderActionBar = (
        <Touchable
            onPress={this.setModalShow}
            style={styles.videoTextbtn}
        >
            <Text style={styles.btntext}>选集</Text>
        </Touchable>
    )

    renderScene = (route, navigator) => {
        let Component = route.name;
        return (
            <Component navigator={navigator} Navigator={this.props.navigator} item={this.props.route.item} Store={this.Store} route={route} />
        );
    }
    onEnd = () => {
        if(this.Store.isTV){
            this.Store.StoreTv.next();
        }else{
            this.video.onSeek(0,true);
            this.video.onPause();
            Toast.show('影片播放完毕~');
        }
    }
    render() {
        const { navigator, route } = this.props;
        const { layoutTop,modalVisible } = this.state;
        const StoreVideo = this.Store.StoreVideo;
        return (
            <View style={styles.content}>
                <StatusBar barStyle='light-content' backgroundColor='transparent' />
                <View style={styles.videoCon}></View>
                {
                    (this.Store.isRender) && <Video onEnd={this.onEnd} actionBar={this.Store.isTV?this.renderActionBar:null} onSection={this.setModalShow} title={this.Store.title} ref={(ref) => { this.video = ref }} handleBack={this.handleBack} playUri={StoreVideo.playUri} style={{ top: $.STATUS_HEIGHT }} />
                }
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.Store.isShowPop}
                    onRequestClose={this.setModalHide}
                    supportedOrientations={['portrait', 'landscape']}
                >
                    <EpisDetail onClose={this.setModalHide} route={{Store:this.Store}} />
                </Modal>
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
    },
    videoTextbtn:{
        height:40,
        paddingHorizontal:10,
        justifyContent: 'center',
        overflow:'hidden'
    },
    btntext:{
        fontSize:14,
        color:'#fff'
    }
})
