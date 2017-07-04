/**
 * Search
 */

import React, { PureComponent } from 'react';
import {
	Image,
	StyleSheet,
	TouchableOpacity,
	Text,
    ScrollView,
    InteractionManager,
    UIManager,
    LayoutAnimation,
    TextInput,
	View,
} from 'react-native';

import Toast from 'react-native-root-toast';

import SearchStore from '../../util/SearchStore';
import fetchData from '../../util/Fetch';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';
import ScrollViewPager from '../../compoents/ScrollViewPager';
import SearchMovieList from './SearchMovieList';
import SearchLiveList from './SearchLiveList'
import Loading from '../../compoents/Loading';
import Touchable from '../../compoents/Touchable';

@observer
class SearchResult extends PureComponent {
    render(){
        const {searchwords,navigator} = this.props;
        return (
            <ScrollViewPager
                bgColor='#fff'
                tabbarHeight={34}
                tabbarStyle={{ color: '#474747', fontSize: 16 }}
                tabbarActiveStyle={{ color: $.COLORS.mainColor }}
                tablineStyle={{ backgroundColor: $.COLORS.mainColor, height: 2 }}
                tablineHidden={false}>
                <SearchMovieList searchwords={searchwords} navigator={navigator} tablabel='影视' />
                <SearchLiveList searchwords={searchwords} navigator={navigator} tablabel='互动直播' />
            </ScrollViewPager>
        )
    }
}

@observer
class SearchHistory extends PureComponent {

    componentWillUpdate(){
        LayoutAnimation.easeInEaseOut();
    }

    onClear(){
        SearchStore.onclear();
    }

    render(){
        const {onSubmit} = this.props;
        return(
            <View style={styles.search_h}>
                <View style={styles.search_h_top}>
                    <Text style={styles.search_h_title}>搜索历史</Text>
                    {
                        SearchStore.size>0&&<TouchableOpacity onPress={this.onClear} style={styles.search_h_clear}><Text style={styles.search_h_text}>清空</Text></TouchableOpacity>
                    }
                </View>
                {
                    SearchStore.size===0?
                    <Text style={styles.search_h_null}>暂无历史记录~</Text>:
                    <View style={styles.search_h_list}>
                    {
                        SearchStore.latest.map((el,i)=>(
                            <TouchableOpacity
                                onPress={()=>onSubmit(el)}
                                key={'key'+i} 
                                style={styles.search_h_item}
                            >
                                <Text numberOfLines={1} style={styles.search_h_el}>{el}</Text>
                            </TouchableOpacity>
                        ))
                    }
                    </View>
                }          
            </View>
        )
    }
}

@observer
class SearchHot extends PureComponent {

    componentWillUpdate(){
        LayoutAnimation.easeInEaseOut();
    }

    render(){
        const {onSubmit,keywords,keywordsisRender} = this.props;
        return(
            <View style={styles.search_hot}>
                <View style={styles.search_hot_hd}><Text style={styles.search_hot_title}>今日热搜</Text></View>
                <View style={styles.search_hot_bd}>
                    {
                        keywordsisRender?
                        keywords.map((el,i)=>(
                            <Touchable
                                onPress={()=>onSubmit(el.displayName)}
                                key={'key'+i}
                                style={styles.search_hot_item}
                            >
                                <Text style={[styles.search_hot_num,{color:(i===0&&'#ff6f2f'||i===1&&'#ff8f21'||i===2&&'#ffae21'||'#9b9b9b')}]}>{i+1}</Text>
                                <Text style={styles.search_hot_name}>{el.displayName}</Text>
                            </Touchable>
                        ))
                        :
                        <Loading size='small' text='' height={100} />
                    }
                </View>
            </View>
        )
    }
}

const SearchCon = (props) => (
    <ScrollView style={styles.content}>
        <SearchHistory onSubmit={props.onSubmit}/>
        <SearchHot onSubmit={props.onSubmit} keywords={props.keywords} keywordsisRender={props.keywordsisRender}/>
    </ScrollView>
)


@observer
export default class extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            isRender:false,
            keywords:[],
            keywordsisRender:false
        }
        //处理安卓Back键
        const { navigator } = this.props;
        const routers = navigator.getCurrentRoutes();
        const top = routers[routers.length - 1];
        top.handleBack = this.onCancel;
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    @observable text = '';

    @observable searchwords = '';
    
    @observable isSearch = false;

    @computed get isEmpty(){
        return this.text.length === 0;
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isRender:true
            })
            this.getHotKeyWorads();
        })
    }

    componentWillUnmount() {
		storage.save({
			key: 'SearchHistory',
			data: SearchStore.list,
			expires: null
		});
	}

    componentWillUpdate(){
        //LayoutAnimation.easeInEaseOut();
    }

    getHotKeyWorads = () => {
        fetchData('GetSearchHotKeywords',{
            maxItems:10
        },(data)=>{
            if(data.currentResults>0){
                this.setState({
                    keywords: data.keywords,
                    keywordsisRender:true
                })
            }
        })
    }

    onSubmit = () => {
        this.onSearch(this.text);
    }

    onSet = (text) => {
        this.text = text;
        this.onSearch(text);
    }

    onSearch = (value) => {
        if(value){
            SearchStore.add(value);
            this.isSearch = true;
            this.searchwords = value;
        }else{
            Toast.show('请输入内容!');
        }
    }

    onEdit = (text) => {
        this.text = text;
        if(this.isEmpty){
            this.isSearch = false;
        }
    }

    onCancel = () => {
        const {navigator} = this.props;
        if(!this.isEmpty){
            this.text = '';
            this.isSearch = false;
        }else{
            navigator.pop();
        }
    }

	render() {
		const { isRender,keywords,keywordsisRender } = this.state;
		return (
            <View style={styles.content}>
                <View style={styles.apptop}>
                    <View activeOpacity={.8} style={styles.search}>
                        <Image style={styles.searchbtn} source={require('../../../img/icon_search.png')} />
                        <TextInput
                            style = {styles.searchtext}
                            value = {this.text}
                            selectionColor = {$.COLORS.mainColor}
                            underlineColorAndroid = 'transparent'
                            onSubmitEditing = {this.onSubmit}
                            onChangeText = {this.onEdit}
                            placeholder = '搜索视频、房间、文章'
                            returnKeyLabel = '搜索'
                            placeholderTextColor = '#909090'
                        />
                    </View>
                    <TouchableOpacity onPress={this.onCancel} activeOpacity={.8} style={styles.cancel}>
                        <Text style={styles.canceltext}>
                            {
                                !this.isEmpty?'清除':'取消'
                            }
                        </Text>
                    </TouchableOpacity>
                </View>
                {
                    isRender?(
                        this.isSearch?
                        <SearchResult navigator={this.props.navigator} searchwords={this.searchwords} />
                        :
                        <SearchCon onSubmit={this.onSet} keywords={keywords} keywordsisRender={keywordsisRender} />
                    )
                    :
                    <Loading/>
                }    
            </View>
		)
	}
}

const styles = StyleSheet.create({
    content:{
        flex:1,
    },
	apptop: {
		paddingTop: $.STATUS_HEIGHT,
		alignItems: 'center',
		backgroundColor: '#fff',
		flexDirection: 'row',
		paddingHorizontal: 5,
        borderBottomWidth:1/$.PixelRatio,
        borderColor:'#ececec',
	},
	search: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#f2f2f2',
		marginHorizontal: 10,
        height:30,
		paddingHorizontal: 18,
		borderRadius: 15,
	},
	searchtext: {
		fontSize: 14,
        flex:1,
        padding:0,
        color:'#474747',
		marginHorizontal: 5
	},
	searchbtn: {
		width: 14,
		height: 14
	},
	cancel: {
		height: 48,
        paddingRight:10,
		justifyContent: 'center',
		alignItems: 'center',
	},
    canceltext:{
        fontSize:16,
        color:'#474747'
    },
    search_h:{
        backgroundColor:'#fff',
        paddingHorizontal:15,
        paddingBottom:5
    },
    search_h_top:{
        flexDirection:'row',
        alignItems:'center',
        height:30
    },
    search_h_title:{
        flex:1,
        fontSize:13,
        color:'#9b9b9b',
    },
    search_h_clear:{
        height:30,
        justifyContent: 'center',
		alignItems: 'center',
    },
    search_h_text:{
        fontSize:14,
        color:'#474747'
    },
    search_h_list:{
        paddingTop:12,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    search_h_item:{
        height:30,
        paddingHorizontal:17,
        backgroundColor:'#f2f2f2',
        justifyContent: 'center',
        borderRadius:15,
        marginRight:10,
        marginBottom:10
    },
    search_h_el:{
        maxWidth:120,
        fontSize:13,
        color:'#474747'
    },
    search_h_null:{
        textAlign:'center',
        color:'#909090',
        fontSize:14,
        padding:10
    },
    search_hot:{
        flex:1,
        backgroundColor:'#fff',
        marginTop:7
    },
    search_hot_hd:{
        height:40,
        justifyContent:'center'
    },
    search_hot_title:{
        fontSize:13,
        color:'#474747',
        marginLeft:15
    },
    search_hot_bd:{
        flex:1,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    search_hot_item:{
        width:$.WIDTH/2,
        paddingLeft:15,
        height:40,
        alignItems:'center',
        flexDirection:'row',
        borderBottomWidth:1/$.PixelRatio,
        borderColor:'#ececec',
    },
    search_hot_num:{
        fontSize:14,
        marginRight:2
    },
    search_hot_name:{
        fontSize:13,
        color:'#474747'
    }
});
