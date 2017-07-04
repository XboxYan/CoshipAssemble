import React, { PureComponent, PropTypes } from 'react';
import {
	StyleSheet,
	Text,
	UIManager,
	LayoutAnimation,
	ScrollView,
	FlatList,
	View,
} from 'react-native';

import Touchable from '../../compoents/Touchable';
import Image from '../../compoents/Image';

import VrListView from './VrListView';
import SecondColumnView from './SecondColumnView';


const ColumnItem = (props) => (
	<Touchable
		onPress={() => props.navigator.push({ name: SecondColumnView, item: props.item })}
		style={styles.columnitem}>
		<Image 
			style={styles.columnico}
			defaultSourceStyle={styles.columnico}
			defaultSource={require('../../../img/smart_icon_default.png')} 
			source={{ uri: 'http://10.9.216.1:8000/' + (props.item.attr.phoneIcoPath || props.item.attr.m_chaImg) }} 
		/>
		<View style={styles.columntext}>
			<Text numberOfLines={1} style={styles.columnname}>{props.item.attr.aliasName || props.item.name}</Text>
		</View>
	</Touchable>
)

export default class extends PureComponent {

	constructor(props) {
		super(props);
	}

	componentWillUpdate(nextProps, nextState) {
		LayoutAnimation.easeInEaseOut();
	}
	render() {
		const { isRender, data } = this.props;
		return (
			<View style={styles.columnloadcontent}>
				{
					data.map((item, index) => <ColumnItem key={index} item={item} navigator={this.props.navigator} />)
				}
			</View>
		)
	}
}


const styles = StyleSheet.create({
	content: {
		flex: 1,
	},
	columnitem: {
		width: ($.WIDTH) / 4,
		paddingVertical: 20,
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	columnico: {
		width: 40,
		height: 40,
	},
	columntext: {
		alignItems: 'center',
		flexDirection: 'row'
	},
	columnname: {
		marginTop: 10,
		fontSize: 14,
		color: '#666',
		textAlign: 'center',
		flex: 1
	},
	label: {
		textAlign: 'center',
		fontSize: 10,
		marginTop: 3,
	},
	columnloadcontent: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		backgroundColor: '#fff'
	},
});