import React, { PureComponent } from 'react';
import {
    StyleSheet,
    ScrollView,
    RefreshControl,
    Image,
    TouchableOpacity,
    UIManager,
    LayoutAnimation,
    InteractionManager,
    Text,
    View,
} from 'react-native';

import fetchData from '../util/Fetch';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MovieList from '../compoents/MovieList';
import Banner from '../compoents/Banner';
import MovieSortView from './MovieSortView';

const MovieMoreLoad = () => (
    <View style={styles.sectionHeader}>
        <View style={styles.MovieMoreLoad}></View>
    </View>
)

const MovieMore = (props) => (
    <View style={styles.sectionHeader}>
        <Image style={styles.sectionType} source={require('../../img/icon_hot.png')} />
        <Text style={styles.sectionText} >{props.title}</Text>
        <TouchableOpacity activeOpacity={.8} style={styles.more}>
            <Text style={styles.moretext}>更多</Text>
            <Icon name='keyboard-arrow-right' size={24} color={$.COLORS.subColor} />
        </TouchableOpacity>
    </View>
)

class MovieSection extends PureComponent {
    state = {
        isRender: false,
        title:'',
        assetId:'',
        movieData:[],
        movieRender:false
    }

    componentWillUpdate(nextProps, nextState) {
        LayoutAnimation.easeInEaseOut();
    }

    _fetchData = () => {
        const { assetId } = this.props;
        fetchData('GetFolderContents',{
            body:'GetFolderContents',
            par:{
                assetId:assetId
            }
        },(data)=>{
            const assetId = data.childFolderList[0].assetId;
            this.setState({
                title: data.childFolderList[0].displayName,
                assetId: assetId,
                isRender: true
            })
            this._fetchMovie(assetId)
        })
    }

    _fetchMovie = (assetId) => {
        fetchData('GetFolderContents',{
            body:'GetFolderContentsList',
            par:{
                assetId:assetId
            }
        },(data)=>{
            if(data.totalResults>0){
                this.setState({
                    movieData: data.selectableItemList,
                    movieRender:true
                })
            }
        })
    }

    componentDidMount() {
        this._fetchData();
    }

    render(){
        const {title,assetId,isRender,movieData,movieRender} = this.state;
        return(
            <View style={styles.section}>
                {
                    isRender?<MovieMore title={title} assetId={assetId} />:<MovieMoreLoad />
                }
                <MovieList data={movieData} isRender={movieRender} navigator={this.props.navigator} />
            </View>
        )
    }
}


const TagEl = (props) => (
    <TouchableOpacity onPress={props.onPress} activeOpacity={.8} style={styles.tagel}>
        <Text style={styles.tageltext}>{props.text}</Text>
    </TouchableOpacity>
)

const TagListLoadView = () => (
    <View style={styles.sortlist}>
        <View style={[styles.tagel, styles.Loadtagel]}></View>
        <View style={[styles.tagel, styles.Loadtagel]}></View>
        <View style={[styles.tagel, styles.Loadtagel]}></View>
    </View>
)

class TagList extends PureComponent {
    state = {
        isRender: false,
        tagList:[]
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

    _fetchData = () => {
        const { assetId } = this.props;
        fetchData('GetRetrieveContent',{
            body:'GetRetrieveContent',
            par:{
                //folderAssetId:assetId
            }
        },(data)=>{
            if(data.retrieveFrameList[0].totalResults>0){
                this.setState({
                    tagList: data.retrieveFrameList[0].contentList,
                    isRender: true
                })
            }	
        })
    }

    componentDidMount() {
        this._fetchData();
    }
    
    render() {
        const { isRender,tagList } = this.state;
        if (!isRender) {
            return <TagListLoadView />
        }
        return (
            <View style={styles.sortlist}>
                {
                    tagList.map((el,i)=>(
                        <TagEl key={i} onPress={this.handle} text={el.value}/>
                    ))
                }
            </View>
        )
    }
}


export default class extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRender: false,
            isRefreshing: false
        }
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    onRefresh = () => {

    }
    render() {
        const { navigator, route, assetId } = this.props;
        const { isRender } = this.state;
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this.onRefresh}
                        tintColor={$.COLORS.mainColor}
                        title="Loading..."
                        titleColor="#666"
                        colors={[$.COLORS.mainColor]}
                        progressBackgroundColor="#fff"
                    />
                }
                style={styles.content}>
                <Banner assetId={assetId} navigator={navigator} />
                <TagList assetId={assetId} navigator={navigator} />
                <MovieSection assetId={assetId} navigator={navigator} />
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
        width:50,
        backgroundColor:'#f1f1f1'
    }
})