import React, { PureComponent, PropTypes } from 'react';
import {
	StyleSheet,
	Text,
	UIManager,
	ActivityIndicator,
	LayoutAnimation,
	FlatList,
	View,
} from 'react-native';

import Touchable from '../../compoents/Touchable';
import Loading from '../../compoents/Loading';
import Image from '../../compoents/Image';
import VideoContentView from './VideoContentView';
import fetchData from '../../util/Fetch';
import { observable, action, computed,autorun } from 'mobx';
import { observer } from 'mobx-react/native';

const MovieEmpty = () => (
	<View style={styles.flexcon}>
		<Text>没有找到影片！</Text>
	</View>
)

const MovieItem = (props) => (
	<Touchable
		onPress={() => props.navigator.push({ name: VideoContentView, item: props.item })}
		style={styles.movieitem}>
		<Image 
			style={styles.movieimg}
			defaultSourceStyle={styles.movieimg}
			source={{uri:Base+(props.item.imageList.length>0?props.item.imageList[0].posterUrl:'')}}
			defaultSource={require('../../../img/poster_moren.png')}
		/>
		<View style={styles.movietext}>
			<Text numberOfLines={1} style={styles.moviename}>{props.item.titleBrief}</Text>
			{
				props.item.isPackage==='1'&&<Text numberOfLines={1} style={styles.movietip}>更新至 第{props.item.currentChapter}集/共{props.item.chapter}集</Text>
			}
			<Text numberOfLines={1} style={styles.movietip}>{`${props.item.folderName} | ${props.item.originName} | ${props.item.year}`}</Text>
			<Text numberOfLines={1} style={styles.movietip}>主演：{props.item.actorsDisplay}</Text>
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
				<Text style={styles.loadtext}>正在加载影片...</Text>
			</View>
		}
    </View>
)

@observer
export default class extends PureComponent {

	constructor(props) {
		super(props);
		UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
	}

	pageIndex = 1;

	@observable isRender = false;

	@observable searchwords = '';

	@observable pageSize = 10;

	@observable data = [];

	@observable isRender = false;

	@observable totalResults = 0;

	@computed get isEnding(){
        return Number(this.totalResults) === this.data.length;
    }

	renderItem = ({ item, index }) => {
		return <MovieItem item={item} navigator={this.props.navigator} />
	}
	componentWillUpdate(nextProps, nextState) {
		if(nextProps.searchwords!=this.props.searchwords){
			this.isRender = false;
			this.pageIndex = 1;
			this.data = [];
			this.searchwords = nextProps.searchwords;
			this.getData();
		}
	}

	componentDidMount() {
		const {searchwords} = this.props;
		this.searchwords = searchwords;
		this.getData();
	}

	getData = () => {
		const startAt = this.pageSize*(this.pageIndex-1)+1;
		fetchData('SearchAction',{
            par:{
				startAt,
                keyword:this.searchwords,
				maxItems:this.pageSize
            }
        },(data)=>{
            this.data = [...this.data,...data.selectableItem];
            this.totalResults = data.totalResults;
            this.isRender = true;
        })
	}

	@action
    loadMore = () => {
        if(!this.isEnding){
            this.pageIndex = this.pageIndex+1;
            this.getData();
        }
    }

	renderFooter = () => {
		if(this.totalResults>0){
			return <LoadView isEnding={this.isEnding} />;
		}else{
			return <MovieEmpty />;
		}
	}
	render() {
		if (!this.isRender) {
			return <Loading size='small' text='' />
		}
		return (
			<FlatList
				removeClippedSubviews={__ANDROID__}
				style={styles.content}
				numColumns={1}
				ListFooterComponent={this.renderFooter}
				data={this.data}
				onEndReached={this.loadMore}
				onEndReachedThreshold={0.1}
				keyExtractor={(item, index) => 'key'+index}
				renderItem={this.renderItem}
			/>
		)
	}
}

const styles = StyleSheet.create({
	content: {
		flex: 1
	},
	movieitem: {
		backgroundColor:'#fff',
		flexDirection:'row',
		paddingHorizontal:10,
		paddingVertical:15,
		borderBottomWidth:1/$.PixelRatio,
        borderColor:'#ececec',
	},
	movieimg: {
		width: 100,
		height: 150,
		resizeMode: 'cover'
	},
	movietext: {
		flex:1,
		marginLeft:15
	},
	moviename: {
		marginTop:5,
		fontSize: 16,
		color: '#474747',
	},
	movietip:{
		fontSize:13,
		color:'#9b9b9b',
		lineHeight:24
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
	},
	flexcon:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding:20
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