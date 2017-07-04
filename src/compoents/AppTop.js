/**
 * AppTop
 */

import React, { PureComponent } from 'react';
import {
	Image,
	StyleSheet,
	TextInput,
	TouchableOpacity,
	Text,
	View,
} from 'react-native';

import LoginStore from '../util/LoginStore';
import LoginView from '../pages/Me/LoginView';
import HistoryView from '../pages/Me/HistoryView';
import SearchView from '../pages/Movie/SearchView';
import SearchStore from '../util/SearchStore';
import Toast from 'react-native-root-toast';
import Appbar from './Appbar';

class PortalView extends PureComponent {
	state = {
		portalid:portalId,
		portalurl:Base
	}
	onEditurl = (text) => {
		this.setState({portalurl:text});
	}
	onEditid = (text) => {
		this.setState({portalid:text});
	}
	onSave = () => {
		const {portalid,portalurl} = this.state;
		const {navigator} = this.props;
		portalId = portalid;
		Base = portalurl;
		storage.save({
			key: 'portalData',
			data: {
				portalid,
				portalurl
			}
		});
		navigator.pop();
		Toast.show('请重启客户端生效~');
	}
	render(){
		const {portalid,portalurl} = this.state;
		return(
			<View style={styles.content}>
				<Appbar navigator={this.props.navigator} title='项目配置' />
				<View style={styles.portalcontent}>
					<View style={styles.portalcon}>
						<Text style={styles.portalname}>BaseURL</Text>
						<TextInput
							value = {portalurl}
							selectionColor = {$.COLORS.mainColor}
							underlineColorAndroid = 'transparent'
							onChangeText = {this.onEditurl}
							blurOnSubmit = {false}
							onSubmitEditing = {(event)=>this.refs.USERNAMETEXTINPUT.focus()}
							returnKeyType = 'next'
							style={styles.portalinput} />
					</View>
					<View style={styles.portalcon}>
						<Text style={styles.portalname}>PortalId</Text>
						<TextInput
							ref = 'USERNAMETEXTINPUT'
							value = {portalid}
							selectionColor = {$.COLORS.mainColor}
							underlineColorAndroid = 'transparent'
							returnKeyType = 'done'
							onChangeText = {this.onEditid}
							style={styles.portalinput} />
					</View>
					<TouchableOpacity onPress={this.onSave} activeOpacity={.8} style={[styles.savebtn,{backgroundColor:$.COLORS.mainColor}]}>
						<Text style={styles.savetext}>保存配置</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}
}

export default class AppTop extends PureComponent {

	onHistory = () => {
		const { navigator } = this.props;
		if (LoginStore.loginState) {
			navigator.push({ name: HistoryView })
		} else {
			navigator.push({ name: LoginView });
		}
	}

	onSearch = () => {
		const { navigator } = this.props;
		navigator.push({ name: SearchView, SceneConfigs: 'FloatFromBottomAndroid' });
	}

	onSet = () => {
		if (this.lastBackPressed&&this.lastBackPressed + 2000 >= Date.now()) {
			if (this.times>=2 ) {
				const { navigator } = this.props;
				navigator.push({ name: PortalView });
				this.times = 0;
				this.lastBackPressed = null;
				return false;
			}
			//console.warn('times'+this.times);
			this.times += 1;
			return false;
		}

		this.times = 0;
		this.lastBackPressed = Date.now();

	}

	componentDidMount() {
		storage.load({
			key: 'SearchHistory',
		}).then(data => {
			SearchStore.list = data;
		}).catch(err => {
			console.log(err);
		})
	}

	render() {
		return (
			<View style={styles.apptop}>
				<TouchableOpacity onPress={this.onSet} activeOpacity={1} style={styles.logowrap}><Image resizeMode='contain' style={styles.logo} source={require('../../img/logo.png')} /></TouchableOpacity>
				<TouchableOpacity onPress={this.onSearch} activeOpacity={.8} style={styles.history}>
					<Image style={styles.historybtn} source={require('../../img/icon_searching.png')} />
				</TouchableOpacity>
				{
					// <TouchableOpacity activeOpacity={.8} style={styles.history}>
					// 	<Image style={styles.historybtn} source={require('../../img/icon_remote.png')} />
					// </TouchableOpacity>
				}
				<TouchableOpacity onPress={this.onHistory} activeOpacity={.8} style={styles.history}>
					<Image style={styles.historybtn} source={require('../../img/icon_history.png')} />
				</TouchableOpacity>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	apptop: {
		paddingTop: $.STATUS_HEIGHT,
		alignItems: 'center',
		backgroundColor: '#fff',
		flexDirection: 'row',
		paddingRight: 5,
		paddingLeft: 15
	},
	logowrap:{
		flex:1,
		alignSelf:'stretch',
		justifyContent:'center'
	},
	logo: {
		height: 18,
		width: 69,
	},
	search: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		height: 30,
		backgroundColor: '#f2f2f2',
		marginHorizontal: 10,
		paddingHorizontal: 18,
		borderRadius: 15,
	},
	searchtext: {
		fontSize: 13,
		marginLeft: 5,
		color: $.COLORS.subColor
	},
	searchbtn: {
		width: 14,
		height: 14
	},
	history: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
	},
	historybtn: {
		width: 24,
		height: 24
	},
	content:{
		flex:1
	},
	portalcon:{
		flexDirection:'row',
		height:50,
		alignItems:'center',
		paddingHorizontal:10
	},
	portalname:{
		width:70,
		fontSize:16,
		color:'#333'
	},
	portalinput:{
		flex:1,
		height:40,
		paddingHorizontal:10,
		backgroundColor:'#fff',
		borderRadius:3,
		fontSize:16
	},
	portalcontent:{
		marginTop:10
	},
	savebtn:{
		marginTop:10,
		height:40,
		justifyContent:'center',
		alignItems:'center',
		borderRadius:20,
		marginHorizontal:10
	},
	savetext:{
		fontSize:16,
		color:'#fff'
	}
});
