/**
 * LiveVideo
 */

import React, { PureComponent, PropTypes } from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    PanResponder,
    Text,
    UIManager,
    LayoutAnimation,
    StatusBar,
    View,
} from 'react-native';

import Touchable from '../../compoents/Touchable';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import Orientation from 'react-native-orientation';
import { observable, action, computed} from 'mobx';
import { observer } from 'mobx-react/native';


@observer
class TipView extends PureComponent {
    Icon = () => {
        const { data,type } = this.props;
        const pos = Math.ceil(data*(type.length-1));
        return type[pos];
    }
    render(){
        const { data,isSet } = this.props;
        return (
            <View style={[styles.actionicon,!isSet&&{opacity:0}]}>
                <Icon name={this.Icon()} size={30} color='#fff' />
                <Text style={styles.actiontext}>{ Math.ceil(data*100)+'%' }</Text>
            </View>
        )
    }
}

@observer
export default class extends PureComponent {

    @observable isFull = false;
    @observable _isSetBright = false;
    @observable _isSetVolumn = false;
    @observable _currentBrightness = 0;
    @observable _currentVolume = 0;

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
            paused: true,
            isChange:true,
            isBuffering:false,
            isShowBar:true,
        };
        if(__ANDROID__){
            UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }

    onLoad = (data) => {
        //console.warn('onLoad')
        this.setState({ paused: false });
        this.onShowBar();
    };

    onPause = () => {
        this.setState({ paused: true });
    }

    onEnd = () => {
        this.setState({ paused: true });
    };

    onPlay = () => {
        this.onShowBar();
        this.setState({ paused: !this.state.paused });
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

    onBuffer = (event) => {
        this.setState({
            isBuffering:event.isBuffering
        })
    }

    onHideBar = (bool) => {
        if(__ANDROID__){
            //LayoutAnimation.easeInEaseOut();
        }
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
        this.$currentTime = this.state.currentTime;
        this._duration = this.state.duration;
        this.$currentBrightness = systemSetting.brightness;
        this.$currentVolume = systemSetting.volume;
        this.$isMoved = false;
    }

    onPanResponderMove = (evt, gestureState) => {

        if(Math.abs(gestureState.dx)>20||Math.abs(gestureState.dy)>20){
            !this.$isMoved&&(this.$isMoved = true);
        }

        if(Math.abs(gestureState.dy)>20&&gestureState.x0<$.WIDTH/2){
            this._isSetBright = true;
        }

        if(Math.abs(gestureState.dy)>20&&gestureState.x0>$.WIDTH/2){
            this._isSetVolumn = true;
        }

        //亮度
        if(this._isSetBright&&Math.abs(gestureState.dx)<20){
            systemSetting.changeScreenModeToManual();
            let currentBrightness = this.$currentBrightness-gestureState.dy*.005;
            if(currentBrightness < 0){
                currentBrightness = 0;
            }
            if(currentBrightness > 1){
                currentBrightness = 1;
            }
            systemSetting.brightness = currentBrightness;
            this._currentBrightness = currentBrightness;
        }else{
            this._isSetBright = false;
        }

        //音量
        if(this._isSetVolumn&&Math.abs(gestureState.dx)<20){
            let currentVolume = this.$currentVolume-gestureState.dy*.005;
            if(currentVolume < 0){
                currentVolume = 0;
            }
            if(currentVolume > 1){
                currentVolume = 1;
            }
            systemSetting.volume = currentVolume;
            this._currentVolume = currentVolume;
        }else{
            this._isSetVolumn = false;
        }

    }

    onPanResponderRelease = (evt, gestureState) => {
        if(this._isSetBright){
            this._isSetBright = false;
        }
        if(this._isSetVolumn){
            this._isSetVolumn = false;
        }
        if(!this.$isMoved){
            const {isShowBar} = this.state;
            if(isShowBar){
                this.timer&&clearTimeout(this.timer);
                this.onHideBar(false);
            }else{
                this.onShowBar();
            }
        }
    }

    componentDidMount(){
        systemSetting.saveBright();
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
        systemSetting.restoreBright();
        this.timer&&clearTimeout(this.timer);
    }

    @action
    setFullScreen = () => {
        if(this.isFull){
            Orientation.lockToPortrait();
        }else{
            Orientation.lockToLandscapeLeft();
        }
        this.isFull = !this.isFull;
    }

    render() {
        const {paused,isBuffering,isShowBar} = this.state;
        const {playUri,style,handleBack,share,title='',isLive,isFocus,onFocus} = this.props;
        return (
            <View style={[styles.container,style,this.isFull?styles.fullScreen:{height:$.WIDTH*9/16}]}>
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
                    onError={this.onError}
                    onEnd={this.onEnd}
                    repeat={false}
                />
                <Text style={[styles.livestate,isLive&&{opacity:0}]}>主播还未开播~</Text>
                <ActivityIndicator color='#fff' size='small' style={ !isBuffering&&{opacity:0}} />
                <TipView data={this._currentBrightness} type={['brightness-5','brightness-4','brightness-6','brightness-7']} isSet={this._isSetBright} />
                <TipView data={this._currentVolume} type={['volume-off','volume-mute','volume-down','volume-up']} isSet={this._isSetVolumn} />
                <View {...this._panResponder.panHandlers} style={[styles.fullScreen,{zIndex:5}]}></View>
                <View style={[styles.videoTop,!isShowBar&&{top:-50}]}>
                    <TouchableOpacity onPress={handleBack} style={styles.back} activeOpacity={.8}>
                        <Icon name='keyboard-arrow-left' size={30} color='#fff'/>
                    </TouchableOpacity>
                    <Text style={[styles.videoTitle,!this.isFull&&{opacity:0}]}>{title}</Text>
                    {
                        // <TouchableOpacity style={[styles.back]} onPress={share}>
                        //     <Icon name='share' size={20} color='#fff'/>
                        // </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={onFocus} style={styles.back} >
                        <Icon name={isFocus?'star':'star-border'} size={24} color='#fff'/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={this.setFullScreen}
                    style={[styles.videobtn,!isShowBar&&{bottom:-40}]}
                >
                    <Icon name={this.isFull?'stay-primary-portrait':'stay-primary-landscape'} size={20} color='#fff' />
                </TouchableOpacity>
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
    videobtn:{
        position:'absolute',
        right:0,
        bottom:0,
        width:50,
        height:40,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex:20
    },
    videoslider:{
        flex:1,
    },
    videotime:{
        fontSize:12,
        color:'#fff'
    },
    videoTop:{
        position:'absolute',
        left:0,
        right:0,
        top:0,
        height: 50,
        zIndex: 10,
        flexDirection:'row',
        alignItems: 'center',
    },
    back:{
        width: 50,
        height: 50,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'rgba(0,0,0,0)',
    },
    videoTitle:{
        flex:1,
        fontSize:16,
        color:'#fff',
        backgroundColor:'rgba(0,0,0,0)'
    },
    share:{
        margin:16,
        width: 16,
        height: 16,
    },
    showTime:{
        position: 'absolute',
        zIndex:4,
        backgroundColor:'rgba(0,0,0,.8)',
        color:'#fff',
        paddingHorizontal:10,
        paddingVertical:5,
        borderRadius:3
    },
    actionicon:{
        position: 'absolute',
        zIndex:4,
        width:80,
        height:80,
        borderRadius:5,
        backgroundColor:'rgba(0,0,0,.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actiontext:{
        marginTop:5,
        fontSize:14,
        color:'#fff'
    },
    videoTextActive:{
        width:0,
        paddingHorizontal:0
    },
    livestate:{
        position:'absolute',
        color:'#fff',
        fontSize:14,
        zIndex:4,
    }
});
