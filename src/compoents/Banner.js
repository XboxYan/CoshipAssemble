import React, { Component } from 'react'
import {
	Text,
	View,
	Image,
	ActivityIndicator,
	Dimensions
} from 'react-native'
import Swiper from 'react-native-swiper';
import fetchData from '../util/Fetch';

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
	state = {
		imgList: [],
		isRender: false
	}

	_fetchData = () => {
		const { assetId } = this.props;
		fetchData('GetAssociatedFolderContents', {
			body: 'GetAssociatedFolderContents',
			id: assetId
		}, (data) => {
			if (data.totalResults > 0) {
				this.setState({
					imgList: data.selectableItem,
					isRender: true
				})
			}
		})
	}

	componentDidMount() {
		this._fetchData();
	}

	render() {
		const { isRender, imgList } = this.state;
		return (
			<View style={styles.wrapper}>
				{
					isRender ?
						<Swiper autoplay={true} height={$.WIDTH * 9 / 16} loop={true}>
							{
								imgList.map((item, i) => <View key={i} style={styles.imgwrap}><Image
									source={{ uri: Base + item.imageList[0].posterUrl }}
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