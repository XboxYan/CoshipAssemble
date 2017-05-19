import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    Image,
    Share,
    ScrollView,
    Navigator,
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

    @observable
    isRender = false;

    constructor(assetId) {
        this._fetchData(assetId);
    }

    _fetchData = (assetId) => {
        fetchData('getPlayURL',{
            headers:{'Content-Type': 'text/json'},
            par:{
                assetId:assetId
            }
        },(data)=>{
            //alert(JSON.stringify(data))
            if(data.ret==='0'){
                this.isRender = true;
                this.playUri = data.palyURL.split('?')[0];
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
                associatedType:'4'
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

    constructor(assetId) {
        this._fetchData(assetId);
    }

    _fetchData = (assetId) => {
        fetchData('GetItemData',{
            par:{
                titleAssetId:assetId
            }
        },(data)=>{
            this.isRender = true;
            this.data = data.selectableItem;
        })
    }
}

class Store {
    @observable
    assetId = '';

    @observable
    isRender = false;

    @computed
    get StoreVideo(){
        return new StoreVideo(this.assetId);
    }

    @computed
    get StoreRecom(){
        return new StoreRecom(this.assetId);
    }

    @computed
    get StoreInfo(){
        return new StoreInfo(this.assetId);
    }

    @action
    setId = (assetId) => {
        this.assetId = assetId;
    }

    @action
    isRendered = () => {
        this.isRender = true;
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
                <MovieCasts isRender={Store.isRender} data={this.data} />
                {
                    item.isPackage=='1'&&<MovieEpisode isRender={isRender} navigator={navigator} />
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
        //LayoutAnimation.linear();
    }

    handleBack = () => {
        if (this.video&&this.video.state.isFull) {
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

    _fetchData = () => {
        const { assetId } = this.props.route.item;
        fetchData('getPlayURL',{
            headers:{'Content-Type': 'text/json'},
            par:{
                assetId:assetId
            }
        },(data)=>{
            if(data.ret==='0'){
                this.setState({
                    playUri: data.palyURL.split('?')[0],
                    isRender: true
                })
            } 
        })
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.Store.setId(this.props.route.item.assetId);
            this.Store.isRendered();
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