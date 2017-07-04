import React, { Component } from 'react'
import {
	Text,
	View,
	ActivityIndicator,
	Dimensions
} from 'react-native'
import Swiper from 'react-native-swiper';
import Image from '../../compoents/Image';
import Touchable from '../../compoents/Touchable';
import SmartDetailView from './SmartDetailView';

const styles = {
	wrapper: {
		height: $.WIDTH * 9 / 16,
	},
	img: {
		width: $.WIDTH ,
		height: $.WIDTH * 9 / 16,
		resizeMode: 'cover'
	},
	imgwrap: {
		flex: 1,
	},
	loadView: {
		flex: 1,
		backgroundColor: '#f1f1f1'
	}
}


export default class extends Component {

	render() {
		const { isRender, imgList, navigator } = this.props;
		return (
			<View style={styles.wrapper}>
				{
					isRender ?
						<Swiper autoplay={true} height={$.WIDTH * 9 / 16} loop={true}>
							{
								imgList.map((item, i) =>
									<Touchable
										onPress={() => navigator.push({ name: SmartDetailView, item: item, isContent: true})}
									 	key={i}
										style={styles.imgwrap}>
										<Image
											source={{ uri: item.attr.titlePic?item.attr.titlePic:Base}}
											defaultSource={require('../../../img/banner_moren.png')}
											style={styles.img}
										/>
									</Touchable>
								)
							}
						</Swiper>
						:
						<View style={styles.loadView}></View>
				}
			</View>
		)
	}
}
