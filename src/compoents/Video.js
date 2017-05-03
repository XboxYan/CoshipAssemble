/**
 * Loading
 */

import React, { PureComponent, PropTypes } from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Slider,
    Image,
    Text,
    StatusBar,
    View,
} from 'react-native';

import Touchable from './Touchable';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Orientation from 'react-native-orientation';

class VideoBar extends PureComponent {

    render(){
        const {setFullScreen,onSeek,onPlay,currentTime,duration,paused,isShow,isFull} = this.props;
        return(
            <View style={[styles.videobar,!isShow&&{opacity:0}]}>
                <Touchable 
                    onPress={onPlay} 
                    style={styles.videobtn}
                >
                    <Icon name={paused?'play-arrow':'pause'} size={24} color='#fff' />
                </Touchable>
                <Text style={styles.videotime}>{moment.utc(currentTime*1000).format("HH:mm:ss")}</Text>
                <Slider 
                    style={styles.videoslider}
                    value={currentTime}
                    onValueChange={(value)=>onSeek(value,false)}
                    onSlidingComplete={(value)=>onSeek(value,true)}
                    maximumValue={duration}
                    maximumTrackTintColor={$.COLORS.mainColor}
                    minimumTrackTintColor='rgba(255,255,255,.5)'
                    thumbTintColor='#fff'
                    thumbImage={require('../../img/thumbImage.png')}
                />
                <Text style={styles.videotime}>{moment.utc(duration*1000).format("HH:mm:ss")}</Text>
                <Touchable
                    onPress={setFullScreen}
                    style={styles.videobtn}
                >
                    <Icon name={isFull?'fullscreen-exit':'fullscreen'} size={24} color='#fff' />
                </Touchable>
            </View>
        )
    }
}

export default class extends PureComponent {

    static PropTypes = {
        playUri: PropTypes.string
    }

    static defaultProps = {
        playUri: '',
        style:{}
    }

    state = {
        duration: 0.0,
        currentTime: 0.0,
        paused: true,
        isChange:true,
        isBuffering:true,
        isFull:false,
        isShowBar:true
    };

    onLoad = (data) => {
        //console.warn('onLoad')
        this.setState({ 
            duration: data.duration,
            paused:false
        });
    };

    onPlay = () => {
        this.setState({ paused: !this.state.paused });
    }

    onPause = () => {
        this.setState({ paused: true });
    }

    onProgress = (data) => {
        if(this.state.isChange){
            this.setState({ currentTime: data.currentTime });
        }
    };

    onEnd = () => {
        this.setState({ paused: true });
        this.video.seek(0);
    };

    onSeek = (value,isChange) => {
        this.setState({ 
            currentTime: value,
            isChange: isChange
        });
        if(isChange){
            this.video.seek(value);
        }
    }

    onLoadStart = () => {
        //console.warn('onLoadStart')
    }

    onReady = () => {
        //console.warn('onReady')
        
    }

    onError = () => {
        console.warn('onError')
    }

    onBuffer = (event) => {
        this.setState({
            isBuffering:event.isBuffering
        })
    }

    onHideBar = (bool) => {
        this.setState({
            isShowBar:bool
        })
    }

    onShowBar = () => {
        this.onHideBar(true);
        this.timer&&clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            this.onHideBar(false);
        },5000)
    }

    componentDidMount(){
        this.timer&&clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            this.onHideBar(false);
        },5000)
    }

    componentWillUnmount(){
        this.timer&&clearTimeout(this.timer);
    }

    setFullScreen = () => {
        const {isFull} = this.state;
        if(isFull){
            Orientation.lockToPortrait();
        }else{
            Orientation.lockToLandscape();
        }
        this.setState({
            isFull:!isFull
        })
    }

    render() {
        const {paused,currentTime,duration,isBuffering,isFull,isShowBar} = this.state;
        const {playUri,style} = this.props;
        return (
            <TouchableOpacity onPress={this.onShowBar} activeOpacity={1} style={[styles.container,style,!isFull&&{height:$.WIDTH*9/16},isFull&&styles.fullScreen]}>
                <StatusBar barStyle={isFull?'light-content':'dark-content'}  hidden={isFull} />
                <Video
                    ref={(ref) => { this.video = ref }}
                    source={{ uri: playUri }} 
                    resizeMode="contain" 
                    style={styles.fullScreen}
                    playInBackground={false}
                    paused={paused}
                    onLoadStart={this.onLoadStart}
                    onBuffer={this.onBuffer}
                    onLoad={this.onLoad}
                    onReadyForDisplay={this.onReady}
                    onProgress={this.onProgress}
                    onError={this.onError}
                    onEnd={this.onEnd}
                    repeat={false}
                />
                {
                    <ActivityIndicator color='#fff' size={24} style={ !isBuffering&&{opacity:0}} />
                }
                <VideoBar
                    paused={paused}
                    isShow={isShowBar}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={this.onSeek}
                    onPlay={this.onPlay}
                    isFull={isFull}
                    setFullScreen={this.setFullScreen}
                />
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left:0,
        right:0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    fullScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    videobar:{
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor:'rgba(0,0,0,.5)'
    },
    videobtn:{
        width:40,
        height:40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoslider:{
        flex:1,
    },
    videotime:{
        fontSize:12,
        color:'#fff'
    }

});
