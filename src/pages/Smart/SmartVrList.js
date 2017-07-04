import React, { PureComponent, PropTypes } from 'react';
import {
	StyleSheet,
	Text,
	Image,
	UIManager,
	LayoutAnimation,
	ScrollView,
	FlatList,
	View,
} from 'react-native';

import Touchable from '../../compoents/Touchable';

const ColumnItem = (props) => (
	<Touchable
		onPress={props.onPress}
		style={styles.columnitem}>
		{props.item.icon}
	</Touchable>
)

export default class extends PureComponent {

	constructor(props) {
		super(props);
	}

	componentWillUpdate(nextProps, nextState) {
		//LayoutAnimation.easeInEaseOut();
	}

	render() {
		const { isRender, data } = this.props;

		return (
			<ScrollView contentContainerStyle={styles.columnloadcontent}>
				{
					data.map((item, index) => <ColumnItem key={index} onPress={this.props.onPress} item={item} navigator={this.props.navigator} />)
				}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	columnloadcontent: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingHorizontal: 6,
		backgroundColor: '#fff'
	},
	columnitem: {
		width: ($.WIDTH - 24) / 2,
		height: (($.WIDTH - 24) / 2) * 4 / 7,
		marginBottom: 6,
		marginHorizontal: 3,
		alignItems: 'center',
		backgroundColor: '#fff',
	},

});