/**
 * Loading
 */

import React, { PureComponent, PropTypes } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Slider,
    Image,
    Text,
    View,
} from 'react-native';

import Touchable from './Touchable';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

class VideoBar extends PureComponent {

    render(){
        const {setFullScreen,onSeek,onPlay,currentTime,duration,paused} = this.props;
        return(
            <View style={styles.videobar}>
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
                    <Icon name='fullscreen' size={24} color='#fff' />
                </Touchable>
            </View>
        )
    }
}

export default class extends PureComponent {

    static PropTypes = {
        playUri: PropTypes.string,
        text: PropTypes.string,
        size: PropTypes.number,
        height: PropTypes.number
    }

    static defaultProps = {
        playUri: '',
        color: $.COLORS.mainColor
    }

    state = {
        rate: 1,
        volume: 1,
        muted: false,
        duration: 0.0,
        currentTime: 0.0,
        paused: false,
        isChange:true,
        playUri:''
    };

    onLoad = (data) => {
        console.warn('onLoad')
        this.setState({ duration: data.duration });
    };

    onPlay = () => {
        this.setState({ paused: !this.state.paused });
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

    onBuffer = () => {
        //console.warn('onBuffer')
    }

    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                playUri:'http://v.yoai.com/femme_tampon_tutorial.mp4'
            })
        },1000)
        
    }

    setFullScreen = () => {
        this.video.presentFullscreenPlayer()
    }
    getCurrentTimePercentage() {
        if (this.state.currentTime > 0) {
        return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
        }
        return 0;
    };

    render() {
        const {paused,currentTime,duration} = this.state;
        const {playUri} = this.props;
        return (
            <View style={styles.container}>
                <Video
                    fullscreen={true}
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
                    onEnd={this.onEnd}
                    repeat={false}
                />
                <VideoBar
                    paused={paused}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={this.onSeek}
                    onPlay={this.onPlay}
                    setFullScreen={this.setFullScreen}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
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
