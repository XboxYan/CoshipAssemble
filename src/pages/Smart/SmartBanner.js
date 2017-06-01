import React, { Component } from 'react'
import {
	Text,
	View,
	Image,
	ActivityIndicator,
	Dimensions
} from 'react-native'
import Swiper from 'react-native-swiper';
import fetchData from '../../util/Fetch';

const styles = {
	wrapper: {
		height: $.WIDTH * 9 / 16,
	},
	img: {
		flex: 1,
		width: '100%',
		resizeMode: 'cover'
	},
	imgwrap: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	loadView: {
		flex: 1,
		backgroundColor: '#f1f1f1'
	}
}


export default class extends Component {

	render() {
		const { isRender, imgList } = this.props;
		return (
			<View style={styles.wrapper}>
				{
					true ?
						<Swiper autoplay={true} height={$.WIDTH * 9 / 16} loop={true}>
							{
								imgList.map((item, i) => <View key={i} style={styles.imgwrap}><Image
									source={{ uri: item.posterUrl }}
									style={styles.img}
								/></View>)
							}
						</Swiper>
						:
						<View style={styles.loadView}></View>
				}
			</View>
		)
	}
}