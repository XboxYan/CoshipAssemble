import React,{ Component,PropTypes }from 'react';
import {requireNativeComponent,
        View,
		UIManager,
		findNodeHandle
} from 'react-native';

var RCT_VIDEO_REF = 'PushView'

class PushView extends Component{
	constructor(props){
        super(props);
    }

	startPrev(bitrate,bitrateName,resolution,fps){
		//开始预览画面
		 UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs[RCT_VIDEO_REF]),
            UIManager.PushView.Commands.startPrev,//Commands.pause与native层定义的COMMAND_PAUSE_NAME一致
            [bitrate,bitrateName,resolution,fps]//命令携带的参数数据
        );
	}
	startConnect(url){
		//开始预览画面
		UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs[RCT_VIDEO_REF]),
            UIManager.PushView.Commands.startConnect,//Commands.pause与native层定义的COMMAND_PAUSE_NAME一致
            [url]
        );
	}
	stop(){
		UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs[RCT_VIDEO_REF]),
            UIManager.PushView.Commands.stop,//Commands.pause与native层定义的COMMAND_PAUSE_NAME一致
            null
        );
	}
	changeCamera(){
		UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs[RCT_VIDEO_REF]),
            UIManager.PushView.Commands.changeCamera,//Commands.pause与native层定义的COMMAND_PAUSE_NAME一致
            null
        );
	}
	openFlash(){
		UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs[RCT_VIDEO_REF]),
            UIManager.PushView.Commands.openFlash,//Commands.pause与native层定义的COMMAND_PAUSE_NAME一致
            null
        );
	}
	closeFlash(){
		UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs[RCT_VIDEO_REF]),
            UIManager.PushView.Commands.closeFlash,//Commands.pause与native层定义的COMMAND_PAUSE_NAME一致
            null
        );
	}
	openMagic(){
		UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs[RCT_VIDEO_REF]),
            UIManager.PushView.Commands.openMagic,//Commands.pause与native层定义的COMMAND_PAUSE_NAME一致
            null
        );
	}
	closeMagic(){
		UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs[RCT_VIDEO_REF]),
            UIManager.PushView.Commands.closeMagic,//Commands.pause与native层定义的COMMAND_PAUSE_NAME一致
            null
        );
	}
	openMic(){
		UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs[RCT_VIDEO_REF]),
            UIManager.PushView.Commands.openMic,//Commands.pause与native层定义的COMMAND_PAUSE_NAME一致
            null
        );
	}
	closeMic(){
		UIManager.dispatchViewManagerCommand(
            findNodeHandle(this.refs[RCT_VIDEO_REF]),
            UIManager.PushView.Commands.closeMic,//Commands.pause与native层定义的COMMAND_PAUSE_NAME一致
            null
        );
	}

	//_onPushMessage(event){
    //    if(!this.props.onMessage){
    //        return;
    //   }
    //    this.props.onMessage(event.nativeEvent.message);
   // }

	render(){
		return <RCTPushView ref={RCT_VIDEO_REF}
			{...this.props}
			 //onPushMessage={this._onPushMessage.bind(this)}
		     />;
	}
}

PushView.name = "PushView";
PushView.propTypes = {
	source:PropTypes.shape({
            url:PropTypes.string
        }),
	 onPushMessage:PropTypes.func,
	...View.propTypes
};

var RCTPushView = requireNativeComponent("PushView",PushView);
module.exports = PushView;
