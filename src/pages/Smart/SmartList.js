import React, { PureComponent, PropTypes } from 'react';
import {
	StyleSheet,
	Text,
	Image,
	UIManager,
	LayoutAnimation,
	FlatList,
	View,
} from 'react-native';

import Touchable from '../../compoents/Touchable';

const MovieItem = (props) => (
	<Touchable
		onPress={() => props.navigator.push({ name: VideoContentView, item: props.item })}
		style={styles.movieitem}>
		{props.item.columnIcon}
		<View style={styles.movietext}>
			<Text numberOfLines={1} style={styles.moviename}>{props.item.columnName}</Text>
		</View>
	</Touchable>
)

export default class extends PureComponent {

	constructor(props) {
		super(props);
	}

	renderItem = ({ item, index }) => {
		return <MovieItem item={item} navigator={this.props.navigator} />
	}
	componentWillUpdate(nextProps, nextState) {
		LayoutAnimation.easeInEaseOut();
	}
	render() {
		const { isRender, data } = this.props;

		return (
			<FlatList
				style={styles.content}
				numColumns={4}
				data={data}
				keyExtractor={(item, index) => item.columnId}
				renderItem={this.renderItem}
			/>
		)
	}
}
				

const styles = StyleSheet.create({
	content: {
		flex: 1,
	},
	movieitem: {
		width: ($.WIDTH) / 4,
		paddingVertical:20,
		alignItems: 'center',
		backgroundColor: '#fff',
	},
	movietext: {
		alignItems: 'center',
		flexDirection: 'row'
	},
	moviename: {
		marginTop: 10,
		fontSize: 14,
		color: '#333',
		textAlign: 'center',
		flex: 1
	},
	label: {
		textAlign: 'center',
		fontSize: 10,
		marginTop: 3,
	},
	movieloadcontent: {
		flex: 1,
		paddingHorizontal: 5,
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	movieloadtext: {
		height: 40,
	}
});