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

import Appbar from '../compoents/Appbar';
import Video from '../compoents/Video';
import MovieCasts from '../compoents/MovieCasts';
import MovieInfo from '../compoents/MovieInfo';
import MovieRecom from '../compoents/MovieRecom';
import MovieEpisode from '../compoents/MovieEpisode';
import MovieComment from '../compoents/MovieComment';

class VideoInfo extends React.PureComponent {
    data = [1,1,1,1,11,1,1];

    arr = new Array(142).fill(1);

    arrs = this.arr.map((el,i)=>({key:i,num:i+1}));
    

    commentPosY = 0;

    onCommentLayout = (e) => {
        let {y} = e.nativeEvent.layout;
        this.commentPosY = y;
    }
    onScrollToComment = () => {
        
        this.scrollview.scrollTo({y:this.commentPosY,animated: true})
    }
    render() {
        const {navigator,isRender} = this.props;
        return (
            <ScrollView ref={(scrollview)=>this.scrollview=scrollview} style={styles.content}>
                <MovieInfo isRender={isRender} navigator={navigator} onScrollToComment={this.onScrollToComment} />
                <MovieCasts isRender={isRender} data={this.data} />
                <MovieEpisode isRender={isRender} navigator={navigator} data={this.arrs} />
                <MovieRecom isRender={isRender} data={this.data} />
                <MovieComment isRender={isRender} onCommentLayout={this.onCommentLayout} />
            </ScrollView>
        )
    }
}

export default class extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isRender: false,
            layoutTop: 0
        }
        //处理安卓Back键
        const { navigator } = this.props;
        const routers = navigator.getCurrentRoutes();
        const top = routers[routers.length - 1];
        top.handleBack = this.handleBack;
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    componentWillUpdate(nextProps,nextState){
        LayoutAnimation.spring();
    }

    handleBack = () => {
        if (this.video.state.isFull) {
            this.video.setFullScreen();
        } else {
            const navigator = this.navigator;
            const routers = navigator.getCurrentRoutes();
            if(routers.length>1){
                navigator.pop();
            }else{
                this.video.onPause();
                this.props.navigator.pop();
            }
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isRender: true,
                playUri: 'http://bofang.bati.cc/rr/HongMaoLanTuHuoFengHuang_hd.m3u8'
                //playUri:'http://gslb.hrtn.net:8080/live/coship,TWSX1421638319994522.m3u8?fmt=x264_0k_mpegts&sora=1&sk=C90839043C325195586FA305460BE05E&uuid=bab357c2-1be7-40cf-9883-67d9547a8f6f&userCode=hrb002&userName=hrb002&spCode=484581254562&productCode=dpacdb100&resourceCode=102400201&subId=99999999&resourceName=&authType=2'
            })
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
        const { isRender } = this.state;
        return (
            <Component navigator={navigator} isRender={isRender} route={route} />
        );
    }
    render() {
        const { navigator, route } = this.props;
        const { isRender, layoutTop, playUri } = this.state;
        return (
            <View style={styles.content}>
                <StatusBar barStyle='light-content' backgroundColor='transparent' />
                <View onLayout={this.onLayout} style={styles.videoCon}></View>
                {
                    isRender && <Video ref={(ref) => { this.video = ref }} handleBack={this.handleBack} playUri={playUri} style={{ top: layoutTop }} />
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