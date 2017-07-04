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
import SmartDetailView from './SmartDetailView';


const ColumnItem = (props) => (
	<Touchable
		onPress={() => props.navigator.push({ name: props.item.childCount > 0 ? SecondColumnView : SmartDetailView, item: props.item, isContent: false })}
		style={styles.columnitem}>

		<View style={styles.safetyHeader}>
			<Image 
				style={styles.safetyType} 
				defaultSourceStyle={styles.safetyType}
				defaultSource={require('../../../img/smart_icon_default.png')} 
				source={{ uri: 'http://10.9.216.1:8000/' + (props.item.attr.phoneIcoPath || props.item.attr.m_chaImg) }} 
			/>
			<Text numberOfLines={1} style={styles.safetyText}>{props.item.attr.aliasName || props.item.name}</Text>
		</View>
	</Touchable>
)

const EmptyView = () => (
    <View style={styles.flexcon}>
        <Text style={styles.text}>暂时找不到内容~</Text>
    </View>
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
		if(data.length==0){
			return <EmptyView/>
		}
		return (
			<ScrollView style={{flex:1}}>
				<View style={styles.columncontent}>
					{
						data.map((item, index) => <ColumnItem key={index} item={item} navigator={this.props.navigator} />)
					}
				</View>
			</ScrollView>
		)
	}
}


const styles = StyleSheet.create({
	columncontent: {
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	columnitem: {
		width: $.WIDTH / 2,
		height: 48,
		borderBottomWidth: 1 / $.PixelRatio,
		borderRightWidth: 1 / $.PixelRatio,
		borderColor: '#e1e1e1',
		alignItems: 'center',
		backgroundColor: '#fff',
	},

	safetyHeader: {
		justifyContent: 'center',
		alignItems: 'center',
		height: 48,
		paddingHorizontal: 20,
		flexDirection: 'row'
	},
	safetyType: {
		width: 24,
		height: 24
	},
	safetyText: {
		flex: 1,
		fontSize: 16,
		color: '#666',
		marginLeft: 10
	},
	flexcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
	text:{
		fontSize: 14,
        color: '#333',
	}
});