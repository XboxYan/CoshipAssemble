import React, { PureComponent } from 'react';
import {
    StyleSheet,
    ScrollView,
    RefreshControl,
    Image,
    TouchableOpacity,
    UIManager,
    ToastAndroid,
    LayoutAnimation,
    InteractionManager,
    Text,
    View,
} from 'react-native';

import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';

import fetchData from '../../util/Fetch';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MovieList from '../../compoents/MovieList';
import Banner from '../../compoents/Banner';
import MovieSortView from './MovieSortView';
import MovieMoreView from './MovieMoreView';

const MovieMoreLoad = () => (
    <View style={styles.sectionHeader}>
        <View style={styles.MovieMoreLoad}></View>
    </View>
)

@observer
class MovieMore extends PureComponent {
    onHandle = () => {
        const {store,navigator} = this.props;
        navigator.push({
            name:MovieMoreView,
            title:store.MovieSectionTitle,
            assetId:store.MovieSectionId
        })
    }
    render(){
        const {store} = this.props;
        return(
            <View style={styles.sectionHeader}>
                <Image style={styles.sectionType} source={require('../../../img/icon_hot.png')} />
                <Text style={styles.sectionText} >{store.MovieSectionTitle}</Text>
                {
                    store.MovietotalResults>6&&
                    <TouchableOpacity onPress={this.onHandle} activeOpacity={.8} style={styles.more}>
                        <Text style={styles.moretext}>更多</Text>
                        <Icon name='keyboard-arrow-right' size={24} color={$.COLORS.subColor} />
                    </TouchableOpacity>
                }
            </View>
        )
    }
}

@observer
class MovieSection extends PureComponent {

    componentWillUpdate(nextProps, nextState) {
        LayoutAnimation.easeInEaseOut();
    }

    render(){
        const {navigator,store}=this.props;
        return(
            <View style={styles.section}>
                {
                    (!store.isRefreshingMovieTitle)?<MovieMore navigator={navigator} store={store} />:<MovieMoreLoad />
                }
                <MovieList data={store.MovieDataList} isRender={!store.isRefreshingMovieSection} navigator={navigator} />
            </View>
        )
    }
}


const TagEl = (props) => (
    <TouchableOpacity onPress={props.onPress} activeOpacity={.8} style={styles.tagel}>
        <Text style={styles.tageltext}>{props.text}</Text>
    </TouchableOpacity>
)

@observer
class TagList extends PureComponent {
    state = {
        isRender: false,
        tagList:['','','']
    }
    handle = () => {
        const { navigator } = this.props;
        navigator.push({
            name: MovieSortView
        })
    }

    componentWillUpdate(nextProps, nextState) {
        LayoutAnimation.easeInEaseOut();
    }
    
    render() {
        const { isRender,tagList } = this.props;
        return (
            <View style={styles.sortlist}>
                {
                    tagList.map((el,i)=>(
                        isRender?<TagEl key={i} onPress={this.handle} text={el.value}/>:<View key={i} style={[styles.tagel, styles.Loadtagel]}></View>
                    ))
                }
            </View>
        )
    }
}

class Store{
    @observable
    assetId='';

    @observable
    isRefreshingBanner = true;

    @observable
    BannerList = [];

    @observable
    isRefreshingTagList = true;

    @observable
    tagList = ['','',''];

    @observable
    isRefreshingMovieSection = true;

    @observable
    MovieSection = [];

    @observable
    isRefreshingMovieTitle = true;

    @computed
    get MovieSectionTitle(){
        return this.MovieSection[0].displayName;
    }

    @computed
    get MovieSectionId(){
        return this.MovieSection[0].assetId;
    }

    @observable
    MovieDataList = [];

    @observable
    MovietotalResults = 0;

    @observable
    isTimeout = false;

    @computed
    get isRefreshing(){      
        return this.isRefreshingBanner||this.isRefreshingTagList||this.isRefreshingMovieSection;
    }

    @action
    fetchTimeout = () => {
        this.isTimeout = false;
        this.timer&&clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            if(this.isRefreshing){
                ToastAndroid.show('请求超时!', ToastAndroid.SHORT);
                this.isTimeout = true;
            }else{
                clearTimeout(this.timer);
            }
        },10000)
    }

    @action
    fetchDataBanner = () => {
		fetchData('GetAssociatedFolderContents', {
			par:{
				quickId:this.assetId
			}
		}, (data) => {
			if (data.totalResults > 0) {
                this.BannerList = data.selectableItem;
                this.isRefreshingBanner = false;
			}
		})
	}

    @action
    fetchDataTagList = () => {
        fetchData('GetRetrieveContent',{
            par:{
                //folderAssetId:this.assetId
            }
        },(data)=>{
            if(data.retrieveFrameList[0].totalResults>0){
                this.tagList = data.retrieveFrameList[0].contentList;
                this.isRefreshingTagList = false;
            }	
        })
    }

    @action
    fetchDataMovieSection = () => {
        fetchData('GetFolderContents',{
            par:{
                assetId:this.assetId
            }
        },(data)=>{
            this.MovieSection = data.childFolderList;
            this.isRefreshingMovieTitle = false;
            this.fetchMovie();
        })
    }

    @action
    fetchMovie = () => {
        fetchData('GetFolderContents',{
            par:{
                assetId:this.MovieSectionId,
                includeSelectableItem:'Y',
            }
        },(data)=>{
            if(data.totalResults>0){
                this.MovieDataList = data.selectableItemList;
                this.MovietotalResults = data.totalResults;
                this.isRefreshingMovieSection = false;
            }
        })
    }
}

@observer
export default class extends PureComponent {

    store = new Store();

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    onRefresh = () => {
        this.store.fetchDataBanner();
        this.store.fetchDataTagList();
        this.store.fetchDataMovieSection();
        this.store.fetchTimeout();
    }

    componentDidMount() {
        const { assetId } = this.props;
        this.store.assetId = assetId;
        this.onRefresh();
    }

    render() {
        const { navigator, assetId } = this.props;
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.store.isRefreshing&&!this.store.isTimeout}
                        onRefresh={this.onRefresh}
                        tintColor={$.COLORS.mainColor}
                        title="Loading..."
                        titleColor="#666"
                        colors={[$.COLORS.mainColor]}
                        progressBackgroundColor="#fff"
                    />
                }
                style={styles.content}>
                <Banner imgList={this.store.BannerList} isRender={!this.store.isRefreshingBanner} navigator={navigator} />
                <TagList tagList={this.store.tagList} isRender={!this.store.isRefreshingTagList} navigator={navigator} />
                <MovieSection store={this.store} navigator={navigator} />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    section: {
        marginTop: 7,
        backgroundColor: '#fff'
    },
    sectionHeader: {
        alignItems: 'center',
        height: 48,
        paddingHorizontal: 10,
        flexDirection: 'row'
    },
    sectionType: {
        width: 16,
        height: 16
    },
    sectionText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 3
    },
    more: {
        alignItems: 'center',
        height: 48,
        flexDirection: 'row'
    },
    moretext: {
        fontSize: 14,
        color: $.COLORS.subColor
    },
    sortlist: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
    },
    tagel: {
        paddingHorizontal: 20,
        height: 32,
        backgroundColor: '#fafafa',
        borderWidth: 1 / $.PixelRatio,
        justifyContent: 'center',
        borderColor: '#ddd',
        borderRadius: 16,
        marginHorizontal: 10,
        marginVertical: 5
    },
    tageltext: {
        fontSize: 12,
        color: '#717171'
    },
    Loadtagel: {
        width: 64,
        backgroundColor: '#f1f1f1',
        borderColor: '#f1f1f1',
    },
    MovieMoreLoad:{
        height:20,
        borderRadius:10,
        width:50,
        backgroundColor:'#f1f1f1'
    }
})