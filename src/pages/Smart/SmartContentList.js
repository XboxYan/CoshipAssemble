import React, { PureComponent, PropTypes } from 'react';
import {
	StyleSheet,
	Text,
	Image,
	UIManager,
	LayoutAnimation,
	ScrollView,
	ActivityIndicator,
	FlatList,
	View,
} from 'react-native';

import Touchable from '../../compoents/Touchable';
import Loading from '../../compoents/Loading';
import SmartDetailView from './SmartDetailView';
import moment from 'moment';
import { observable, action, computed,autorun } from 'mobx';
import { observer } from 'mobx-react/native';

const ContentItem = (props) => (
	<Touchable
		style={styles.itemView}
		onPress={() => props.navigator.push({ name: SmartDetailView, item: props.item, isContent: true })}
	>
		<Text numberOfLines={2} style={styles.weathertext}>{props.item.title}</Text>

		<View style={styles.viewheader}>
			<Text style={styles.origintext}>{props.item.origin ? props.item.origin : '未知来源'}</Text>
			<Text style={styles.datetext}>{moment(props.item.releaseDate, 'YYYYMMDDHHmmss').format('MM-DD HH:mm')}</Text>
		</View>
	</Touchable>
)

const LoadView = (props) => (
    <View style={styles.loadview}>
		{
			props.isEnding?
			<View style={styles.loadmore}>
				<Text style={styles.loadtext}>没有更多了 </Text>
			</View>
			:
			<View style={styles.loadmore}>
				<ActivityIndicator size='small' color={$.COLORS.mainColor} />
				<Text style={styles.loadtext}>正在加载更多...</Text>
			</View>
		}
    </View>
)

@observer
export default class extends PureComponent {


	pageIndex = 0;

	id = '';

	@observable isRender = false;

	@observable pageSize = 15;

	@observable data = [];

	@observable result = [];

	@observable isRender = false;

	@computed get isEnding(){
        return this.result < this.pageSize;
    }

	componentWillUpdate(nextProps, nextState) {
		//LayoutAnimation.easeInEaseOut();
	}
	componentDidMount() {
		const {id} = this.props;
		this.id = id;
		this.getContentList();
	}
	getContentList() {
		const startAt = this.pageSize*this.pageIndex;
		let url = `${BASE_SMART}json/content_list.jspx?channelIds[]=${this.id}&first=${startAt}&count=15`;
		fetch(url)
		.then((response) => response.json())
		.then((contentList) => {
			this.data = [...this.data,...contentList];
			this.result = contentList.length;
			this.isRender = true;
		})
		.catch((error) => {
			alert(error);
		});
	}
	@action
    loadMore = () => {
        if(!this.isEnding){
            this.pageIndex = this.pageIndex+1;
            this.getContentList();
        }
    }
	renderItem = ({ item, index }) => {
		return <ContentItem item={item} navigator={this.props.navigator} />
	}
	render() {
		if (!this.isRender) {
			return <Loading />
		}
		return (
			<FlatList
				removeClippedSubviews={__ANDROID__}
				style={styles.content}
				keyExtractor={(item, index) => index}
				data={this.data}
				numColumns={1}
				ListFooterComponent={()=><LoadView isEnding={this.isEnding} />}
				onEndReached={this.loadMore}
				onEndReachedThreshold={0.2}
				renderItem={this.renderItem}
			/>
		)
	}
}


const styles = StyleSheet.create({
	content: {
		flex: 1,
		backgroundColor: '#fff'
	},
	itemView: {
		paddingVertical: 10,
		justifyContent: 'center',
		borderBottomWidth: 1 / $.PixelRatio,
		borderColor: '#e1e1e1',
	},
	weathertext: {
		marginHorizontal: 10,
		fontSize: 16,
		color: '#333',
	},
	viewheader: {
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
		height: 20,
		flexDirection: 'row'
	},
	origintext: {
		marginLeft: 10,
		fontSize: 14,
		color: '#999',
		flex: 1
	},
	datetext: {
		marginRight: 10,
		fontSize: 14,
		color: '#999',
	},
	loadview:{
		padding:20,
		alignItems: 'center',
	},
	loadtext:{
		color:'#ccc',
		fontSize:14,
		paddingHorizontal:5
	},
	loadmore:{
		flexDirection:'row',
		justifyContent: 'center',
	}
});