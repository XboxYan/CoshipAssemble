import React, { Component } from 'react';
import {
	StyleSheet,
	Text,
	StatusBar,
	Modal,
	ScrollView,
	TouchableOpacity,
	InteractionManager,
	View
} from 'react-native';
import PushView from '../../compoents/PushView';
import Touchable from '../../compoents/Touchable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Orientation from 'react-native-orientation';
import Toast from 'react-native-root-toast';
import fetchLive, { fetchPost } from './FetchLive';
import LoginStore from '../../util/LoginStore';

export default class PushVideo extends Component {
	constructor(props) {
		super(props);
		this.state = {
			columnList: [],
			columnId: '',
			columnName: '',
			showModal: false,
			microphoneState: true,
			filterState: false,
			flashState:false,
			camareState: false,
			isColumnName: false,
			isLive: false,
			isFront:true,
			source:{
				bitrate: '',
				bitrateName: '',
				resolution: '',
				fps: ''
			},
			isRender:false
		}
		//处理安卓Back键
		const { navigator } = this.props;
		const routers = navigator.getCurrentRoutes();
		const top = routers[routers.length - 1];
		top.handleBack = this.handleBack;
	}
	handleBack = () => {
		this.video.stop();
		this.changeLiveStatus(false);
		Orientation.lockToPortrait();
		this.props.navigator.pop();
	}
	start = () => {
		const { isColumnName } = this.state;
		if (isColumnName) {
			this.changeLiveStatus(true);
		} else {
			Toast.show('请先选择一个栏目');
		}
	}

	changeCamera = () => {
		const { isFront } = this.state;
		this.setState({
			isFront: !isFront
		})
		if(!isFront){
			this.setState({flashState:false});
			Toast.show(`已关闭闪光灯`);
		}
		this.video.changeCamera();
	}

	switchFilter = () => {
		const { filterState } = this.state;
		if(filterState){
			this.video.closeMagic();
			this.setState({filterState: false});
			Toast.show(`已关闭美颜`);
		}else{
			this.video.openMagic();
			this.setState({filterState: true});
			Toast.show(`已开启美颜`);
		}
	}

	switchFlash = () => {
		const { flashState } = this.state;
		if(flashState){
			this.video.closeFlash();
			this.setState({flashState:false});
			Toast.show(`已关闭闪光灯`);
		}else{
			this.video.openFlash();
			this.setState({flashState:true});
			Toast.show(`已开启闪光灯`);
		}	
		
	}

	switchVioce = () => {
		const { microphoneState } = this.state;
		this.setState({
			microphoneState: !microphoneState
		})
		if(microphoneState){
			this.video.closeMic();
			Toast.show(`已关闭麦克风`);
		}else{
			this.video.openMic();
			Toast.show(`已开启麦克风`);
		}
		
	}

	changeLiveStatus = (isLive) => {
		const { liveUserCode, liveUserId } = LoginStore;
		const Live = isLive ? 1 : 2;
		fetchPost('changeLiveStatus', {
			userId: liveUserId,
			userCode: liveUserCode,
			liveWay: 1,
			type: 1,
			isLive: Live
		}, (data) => {
			if (isLive) {
				if(data.success){
					this.setState({ isLive });
					this.video.startConnect(data.retInfo);
				}else{
					Toast.show(data.retInfo);
				}
			} else {
				this.video.stop();
			}
		});
	}

	_getColumnType = () => {
		fetchLive('getColumnType', {

		}, (data) => {
			InteractionManager.runAfterInteractions(() => {
				if (data.dataList && data.dataList.length > 0) {
					this._getColumnList(data.dataList[0].columnTypeId);
				}
			})
		});
	}

	_getColumnList = (columnTypeId) => {
		fetchLive('getColumnList', {
			columnTypeId: columnTypeId
		}, (data) => {
			InteractionManager.runAfterInteractions(() => {
				if (data.dataList && data.dataList.length > 0) {
					this.setState({ columnList: data.dataList })
				}
			})
		});
	}

	updateRoomColumn = (columnId, columnName) => {
		const { liveUserCode, liveUserId } = LoginStore;
		fetchPost('updateRoomColumn', {
			columnId: columnId,
			userId: liveUserId,
			userCode: liveUserCode
		}, (data) => {
			this.setState({isColumnName:true,columnName,columnId})
			LoginStore.userInfo.liveUserInfo.roomInfo.columnInfo.columnId = columnId;
			LoginStore.userInfo.liveUserInfo.roomInfo.columnInfo.columnName = columnName;
			storage.save({
				key: 'userInfo',
				data: LoginStore.userInfo,
			});
		});
	}

	componentWillMount() {
		Orientation.lockToLandscapeLeft();
	}

	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
			//Orientation.lockToLandscapeLeft();
			this._getColumnType();
			const { columnId, columnName } = LoginStore.userInfo.liveUserInfo.roomInfo.columnInfo;
			const { modUserInfo:{bitrate,bitrateTxt,resolution,fps} } = this.props.route;
			const isColumnName = columnName ? true : false;
			this.setState({ 
				columnName, 
				isColumnName, 
				columnId,
				isRender:true
			});
			this.video.startPrev(bitrate+'',bitrateTxt+'',fps+'',resolution+'');
		})
	}
	componentWillUnmount() {
		InteractionManager.runAfterInteractions(() => {
			//Orientation.lockToPortrait();
		})

	}
	choose = (columnId, columnName) => {
		this.updateRoomColumn(columnId, columnName);
		this.setState({ columnId, columnName });
		this.onModelHide();
	}
	onModelHide = () => {
		this.setState({ showModal: false });
	}
	onModelShow = () => {
		this.setState({ showModal: true });
	}
	render() {
		const { microphoneState, filterState,flashState,isRender,isFront, columnName, columnId, showModal, columnList, isLive } = this.state;
		
		return (
			<View style={[styles.container, { backgroundColor: '#000' }]}>
				<StatusBar hidden={true} />
				<Modal
					animationType={"fade"}
					transparent={true}
					visible={showModal}
					supportedOrientations={['portrait', 'landscape']}
					onRequestClose={this.onModelHide}
				>
					<TouchableOpacity activeOpacity={1} style={styles.fullScreenView} onPress={this.onModelHide}>
						<View style={styles.dialog}>
							<ScrollView styles={styles.container} >
								{
									columnList.map((item, index) =>
										<Touchable style={styles.choose} key={item.columnId} onPress={() => this.choose(item.columnId, item.columnName)}>
											<Text style={styles.itemtext}>{item.columnName}</Text>
											<Icon name='check' style={item.columnId != columnId && { opacity: 0 }} size={24} color={$.COLORS.mainColor} />
										</Touchable>
									)
								}
							</ScrollView>
						</View>
					</TouchableOpacity>
				</Modal>
				<PushView
					ref={(video) => { this.video = video }}
					style={styles.container}
					source={{
						bitrate: '4000',
						bitrateName: 'SD',
						resolution: '640*480',
						fps: '20'
					}}
					onPushMessage={(e) => {
						//alert(e.nativeEvent.what);
					}}
				/>
				<View style={styles.view}>
					<View style={styles.viewtop}>
						<TouchableOpacity onPress={this.handleBack} style={styles.btn} activeOpacity={.8}>
							<Icon name='close' size={24} color='#fff' />
						</TouchableOpacity>
						<View style={styles.container}></View>

						<TouchableOpacity style={[styles.btn,isFront&&{width:0}]} onPress={this.switchFlash} activeOpacity={.7}>
							<Icon name={flashState ? 'flash' : 'flash-off'} size={24} color='#fff' />
						</TouchableOpacity>
						<TouchableOpacity style={styles.btn} onPress={this.switchVioce} activeOpacity={.7}>
							<Icon name={microphoneState ? 'microphone' : 'microphone-off'} size={24} color='#fff' />
						</TouchableOpacity>
						<TouchableOpacity style={styles.btn} onPress={this.switchFilter} activeOpacity={.7}>
							<Icon name={filterState ? 'blur' : 'blur-off'} size={24} color='#fff' />
						</TouchableOpacity>
						<TouchableOpacity style={styles.btn} onPress={this.changeCamera} activeOpacity={.7}>
							<Icon name='camera-party-mode' size={24} color='#fff' />
						</TouchableOpacity>
					</View>
					<View style={[styles.viewcon,isLive&&{opacity:0}]} pointerEvents={isLive?'none':'auto'} >
						<TouchableOpacity style={styles.typebtn} onPress={this.onModelShow} activeOpacity={.8}>
							<Text style={styles.typetext}>{columnName || '请先选择一个栏目'}</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.start} style={styles.startbtn} activeOpacity={.8}>
							<Text style={styles.starttext}>开始直播</Text>
						</TouchableOpacity>
					</View>
				</View>
				
				<Text style={[styles.live,!isLive&&{opacity:0}]}>•LIVE•</Text>
			</View>
		);
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	view: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'row',
	},
	viewtop: {
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		height: 50,
		flexDirection: 'row'
	},
	btn: {
		width: 50,
		height: 50,
		zIndex: 10,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0)',
	},
	viewcon: {
		flex: 1,
		alignSelf: 'stretch',
		marginHorizontal: 150,
		backgroundColor: 'rgba(0,0,0,.3)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	startbtn: {
		alignSelf: 'stretch',
		borderRadius: 3,
		height: 44,
		marginHorizontal: 30,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: $.COLORS.mainColor
	},
	starttext: {
		color: '#fff',
		fontSize: 14
	},
	typebtn: {
		height: 36,
		borderRadius: 18,
		paddingHorizontal: 18,
		justifyContent: 'center',
		backgroundColor: 'rgba(255,255,255,.3)',
		marginBottom: 20
	},
	typetext: {
		fontSize: 12,
		color: '#fff'
	},
	fullScreenView: {
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center',
	},
	dialog: {
		backgroundColor: '#fff',
		borderRadius: 3,
		width: 200,
		padding: 10,
		height: 250,
	},
	choose: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 10,
		height: 40,
	},
	itemtext: {
		backgroundColor: 'rgba(0,0,0,0)',
		flex: 1,
		fontSize: 16,
	},
	live:{
		position:'absolute',
		left:10,
		bottom:10,
		borderRadius:2,
		padding:5,
		fontWeight:'bold',
		backgroundColor:'rgba(255,255,255,.3)',
		fontSize:12,
		color:$.COLORS.mainColor
	}
});
