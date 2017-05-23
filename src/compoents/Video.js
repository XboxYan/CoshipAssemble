/**
 * Loading
 */

import React, { PureComponent, PropTypes } from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Slider,
    PanResponder,
    Image,
    Text,
    UIManager,
    LayoutAnimation,
    StatusBar,
    View,
} from 'react-native';

import Touchable from './Touchable';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Orientation from 'react-native-orientation';
import { observable, action, computed} from 'mobx';
import { observer } from 'mobx-react/native';

@observer
class VideoBar extends PureComponent {

    componentWillMount() {

    }

    render(){
        const {setFullScreen,onSeek,onPlay,currentTime,duration,paused,isShow,isFull,shiftTime,shiftProgress} = this.props;
        const showCurrentTime = currentTime + shiftTime;
        const showEndTime = duration + shiftTime;
        return(
            <View style={[styles.videobar,!isShow&&{bottom:-40}]}>
                <Touchable
                    onPress={onPlay}
                    style={styles.videobtn}
                >
                    <Icon name={paused?'play-arrow':'pause'} size={24} color='#fff' />
                </Touchable>
                <Text style={styles.videotime}>{moment.utc(showCurrentTime*1000).format("HH:mm:ss")}</Text>
                <Slider
                    style={styles.videoslider}
                    value={currentTime}
                    onValueChange={(value)=>onSeek(value,false)}
                    onSlidingComplete={(value)=>onSeek(value,true)}
                    maximumValue={duration}
                    maximumTrackTintColor={__IOS__?'rgba(255,255,255,.5)':$.COLORS.mainColor}
                    minimumTrackTintColor={__IOS__?$.COLORS.mainColor:'rgba(255,255,255,.5)'}
                    thumbTintColor='#fff'
                    thumbImage={require('../../img/thumbImage.png')}
                />
                <Text style={styles.videotime}>{moment.utc(showEndTime*1000).format("HH:mm:ss")}</Text>
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

@observer
export default class extends PureComponent {

    @observable isFull;

    static PropTypes = {
        playUri: PropTypes.string
    }

    static defaultProps = {
        playUri: '',
        style:{}
    }

    constructor(props) {
        super(props);
        this.state = {
            duration: 0.0,
            currentTime: 0.0,
            paused: true,
            isChange:true,
            isBuffering:true,
            isShowBar:true,
            isMove:false,
            _currentTime:0
        };
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    onLoad = (data) => {
        //console.warn('onLoad')
        this.onShowBar();
        const { durationTV=0, shiftProgress=0 } = this.props;
        this.setState({
            duration: durationTV >0 ? durationTV : data.duration,
            paused:false
        });
    };

    onPlay = () => {
        this.onShowBar();
        this.setState({ paused: !this.state.paused });
    }

    onPause = () => {
        this.setState({ paused: true });
    }

    onProgress = (data) => {
        if(this.state.isChange){
            const { shiftProgress=0 } = this.props;
            this.setState({ currentTime: data.currentTime + shiftProgress});
        }
    };

    onEnd = () => {
        const {endFilter} = this.props;
        if(endFilter && endFilter()){
            return;//ignore
        }
        this.setState({ paused: true,currentTime:0 });
        this.video.seek(0);
    };

    onSeek = (value,isChange) => {
        this.onShowBar();
        const {seekFilter} = this.props;
        this.setState({
            isChange: isChange
        });
        if(seekFilter && seekFilter(value, isChange)){
            return;//ignore
        }
        this.setState({
            currentTime: value,
        });
        if(isChange){
            this.video.seek(value);
            this.setState({
                isBuffering: true
            });
        }
    }

    onLoadStart = () => {
        //console.warn('onLoadStart')
    }

    onReady = () => {
        // this.setState({
        //     isBuffering:false
        // })
    }

    onError = () => {
        console.warn('onError')
    }

    onTimedMetadata = () => {
        //console.warn('onTimedMetadata')
    }

    onBuffer = (event) => {
        this.setState({
            isBuffering:event.isBuffering
        })
    }

    onPlaybackStalled = (event) => {
        // this.setState({
        //     isBuffering:true
        // })
    }
    onPlaybackResume = (event) => {
        // this.setState({
        //     isBuffering:false
        // })
    }

    onHideBar = (bool) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({
            isShowBar:bool
        })
    }

    onShowBar = () => {
        this.timer&&clearTimeout(this.timer);
        this.onHideBar(true);
        this.timer = setTimeout(()=>{
            this.onHideBar(false);
        },5000)
    }

    onPanResponderGrant = (evt, gestureState) => {
        this.timer&&clearTimeout(this.timer);
        this.onHideBar(true);
        this._currentTime = this.state.currentTime;
        this._duration = this.state.duration;
        this._isSet = false;
    }

    onPanResponderMove = (evt, gestureState) => {
        if(Math.abs(gestureState.dx)>20){
            this._isSet = true;
        }

        if(this._isSet&&Math.abs(gestureState.dy)<20){
            if(!this.state.isMove){
                this.setState({isMove:true});
            }
            let current = this._currentTime+gestureState.dx;
            if(current < 0){
                current = 0;
            }
            if(current > this._duration){
                current = this._duration;
            }
            this.setState({_currentTime:current})
        }
    }

    onPanResponderRelease = (evt, gestureState) => {
        if(this._isSet){
            const {_currentTime} = this.state;
            this.setState({isMove:false,currentTime: _currentTime,isBuffering:true});
            this.onSeek(_currentTime, true);
            // this.video.seek(_currentTime);
        }
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

    componentWillMount() {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: this.onPanResponderGrant,
            onPanResponderMove: this.onPanResponderMove,
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: this.onPanResponderRelease,
            onPanResponderTerminate: (evt, gestureState) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return false;
            },
        });
    }

    componentWillUnmount(){
        this.timer&&clearTimeout(this.timer);
    }

    @action
    setFullScreen = () => {
        if(this.isFull){
            Orientation.lockToPortrait();
        }else{
            Orientation.lockToLandscape();
        }
        this.isFull = !this.isFull;
    }

    render() {
        const {paused,currentTime,duration,isBuffering,isShowBar,isMove,_currentTime} = this.state;
        const {playUri,style,handleBack,onEnd,shiftTime=0} = this.props;
        return (
            <View style={[styles.container,style,!this.isFull&&{height:$.WIDTH*9/16},this.isFull&&styles.fullScreen]}>
                <StatusBar hidden={this.isFull} />
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
                    onPlaybackStalled={this.onPlaybackStalled}
                    onPlaybackResume={this.onPlaybackResume}
                    onTimedMetadata={this.onTimedMetadata}
                    onReadyForDisplay={this.onReady}
                    onProgress={this.onProgress}
                    onError={this.onError}
                    onEnd={onEnd ? onEnd : this.onEnd}
                    repeat={false}
                />
                <ActivityIndicator color='#fff' size='small' style={ !isBuffering&&{opacity:0}} />
                <Text style={[styles.showTime,!isMove&&{opacity:0}]}>
                    <Text style={{color:$.COLORS.mainColor}}>{moment.utc((_currentTime + shiftTime)*1000).format("HH:mm:ss")}</Text>
                    /{moment.utc((duration + shiftTime)*1000).format("HH:mm:ss")}
                </Text>
                <View {...this._panResponder.panHandlers} style={[styles.fullScreen,{zIndex:5}]}></View>
                <TouchableOpacity onPress={handleBack} style={[styles.back,!isShowBar&&{top:-50}]} activeOpacity={.8}>
                    <Icon name='keyboard-arrow-left' size={30} color='#fff'/>
                </TouchableOpacity>
                <VideoBar
                    paused={paused}
                    isShow={isShowBar}
                    shiftTime={shiftTime}
                    currentTime={currentTime}
                    duration={duration}
                    onSeek={this.onSeek}
                    onPlay={this.onPlay}
                    isFull={this.isFull}
                    setFullScreen={this.setFullScreen}
                />
            </View>
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
        zIndex:10,
        overflow: 'hidden',
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
        zIndex:10,
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
    },
    back:{
        position:'absolute',
        left:0,
        top:0,
        width: 50,
        height: 50,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'rgba(0,0,0,0)',
    },
    showTime:{
        marginTop:5,
        backgroundColor:'rgba(0,0,0,.8)',
        color:'#fff',
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:3
    }
});
