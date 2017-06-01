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

import Touchable from './Touchable';
import VideoContentView from '../pages/Movie/VideoContentView';
import Loading from './Loading';

const MovieLoadView = () => (
	<View style={styles.movieloadcontent}>
		<View style={styles.movieitem}>
			<View style={styles.movieimgwrap} />
			<View style={styles.movieloadtext} />
		</View>
		<View style={styles.movieitem}>
			<View style={styles.movieimgwrap} />
			<View style={styles.movieloadtext} />
		</View>
		<View style={styles.movieitem}>
			<View style={styles.movieimgwrap} />
			<View style={styles.movieloadtext} />
		</View>
		<View style={styles.movieitem}>
			<View style={styles.movieimgwrap} />
			<View style={styles.movieloadtext} />
		</View>
		<View style={styles.movieitem}>
			<View style={styles.movieimgwrap} />
			<View style={styles.movieloadtext} />
		</View>
		<View style={styles.movieitem}>
			<View style={styles.movieimgwrap} />
			<View style={styles.movieloadtext} />
		</View>
	</View>
)

const MovieItem = (props) => (
	<Touchable
		onPress={() => props.navigator.push({ name: VideoContentView, item: props.item })}
		style={styles.movieitem}>
		<View style={styles.movieimgwrap}>

		</View>
		<View style={styles.movietext}>
			<Text numberOfLines={1} style={styles.moviename}>{props.item.titleBrief}</Text>
		</View>
	</Touchable>
)

export default class extends PureComponent {

	constructor(props) {
		super(props);
		UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
	}

	renderItem = ({ item, index }) => {
		return <MovieItem item={item} navigator={this.props.navigator} />
	}
	componentWillUpdate(nextProps, nextState) {
		LayoutAnimation.easeInEaseOut();
	}
	render() {
		const { data, isRender } = this.props;
		if (!isRender) {
			return <MovieLoadView />
		}
		return (
			<FlatList
				style={styles.content}
				numColumns={3}
				data={data}
				keyExtractor={(item, index) => item.assetId}
				renderItem={this.renderItem}
			/>
		)
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
		paddingHorizontal: 5,
	},
	movieitem: {
		width: ($.WIDTH - 28) / 3,
		marginHorizontal: 3,
	},
	movieimgwrap: {
		height: ($.WIDTH - 28) / 2,
		backgroundColor: '#f1f1f1'
	},
	movieimg: {
		width: '100%',
		flex: 1,
		resizeMode: 'cover'
	},
	movietext: {
		alignItems: 'center',
		height: 40,
		flexDirection: 'row'
	},
	moviename: {
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
		height: 10,
	}
});