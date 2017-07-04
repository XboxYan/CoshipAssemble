import React, { PureComponent } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  InteractionManager,
  UIManager,
  LayoutAnimation,
  Text,
  View,
} from 'react-native';

import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';

import fetchData from '../../util/Fetch';

import Appbar from '../../compoents/Appbar';
import Loading from '../../compoents/Loading';
import MovieList from '../../compoents/MovieList';


class Item {
    name = '';
    keyWords = '';
    type = '';
    list = null;

    constructor(item,store,type){
        this.keyWords = item.value==='全部'?'':item.value;
        this.name = item.value;
        this.type = type;
        this.list = store;
    }

    @computed
    get isSelected(){
        return this.list.selected[this.type] === this.keyWords;
    }

    @action
    select = () => {
        this.list.selected[this.type] = this.keyWords;
    }

}

class MovieItem {

    store = null;

    pageIndex = 1;

    @observable
    pageSize = 20;

    @observable
    data = [];

    @observable
    isRender = false;

    @observable
    totalResults = 0;

    @computed
    get isEnding(){
        return Number(this.totalResults) === this.data.length;
    }

    constructor(obj){
        this.store = obj;
        this.fetchMovieList();
    }

    fetchMovieList = () => {
        const {origin,assetType,year} = this.store;
        const startAt = this.pageSize*(this.pageIndex-1)+1;
        fetchData('SearchAction',{
            par:{
                origin,
                startAt,
                year,
                keywordType:5,
                keyword:assetType,
                //genre:assetType,
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
            this.fetchMovieList();
        }
    }
}

class Store {
    @observable
    origin = [];

    @observable
    assetType = [];

    @observable
    year = [];

    @observable
    selected = {
        origin:'',
        assetType:'',
        year:'',
    };

    @observable
    isRender = false;

    @computed
    get MovieData(){
        return new MovieItem(this.selected);
    }

    @computed
    get dataOrigin(){
        return [{"value": "全部"},...this.origin].map(item => new Item(item,this,'origin'));
    }

    @computed
    get dataAssetType(){
        return [{"value": "全部"},...this.assetType].map(item => new Item(item,this,'assetType'));
    }

    @computed
    get dataYear(){
        return [{"value": "全部"},...this.year].map(item => new Item(item,this,'year'));
    }

    @action
    fetchDataList = (retrieve) => {
        fetchData('GetRetrieveContent',{
            par:{
                retrieve:retrieve
            }
        },(data)=>{
            if(data.totalResults>0){
                this[retrieve] = data.retrieveFrameList[0].contentList;
            }
        })
    }

}

@observer
class ClassifyItem extends PureComponent {
    render(){
        const {StoreItem} = this.props;
        return(
            <TouchableOpacity onPress={StoreItem.select} activeOpacity={.8} style={[styles.classifyel,StoreItem.isSelected&&styles.classifyActive]}>
                <Text style={[styles.classifytext,StoreItem.isSelected&&styles.classifytextActive]}>{StoreItem.name}</Text>
            </TouchableOpacity>
        )
    }
}

@observer
class ClassifyList extends PureComponent {
    componentDidMount() {
        const {Store,type} = this.props;
        Store.fetchDataList(type);
    }
    render(){
        const {Store,retrieve} = this.props;
        return(
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.classifyitem}>
                {
                    Store[retrieve].map((el,i)=>(
                        <ClassifyItem key={i} StoreItem={el} />
                    ))
                }
            </ScrollView>
        )
    }
}

@observer
export default class MovieSort extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRender:false
        }
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    Store = new Store();
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.Store.isRender = true;
            this.Store.selected.assetType = this.props.route.keyWords;
        })
    }
    render(){
        const {navigator}=this.props;
        const MovieData = this.Store.MovieData;
        return (
            <View style={styles.content}>
                <Appbar title="电影" navigator={navigator} />
                {
                    this.Store.isRender?
                    <View style={styles.content}>
                        <View style={styles.classify}>
                            <ClassifyList type='origin' retrieve='dataOrigin' Store={this.Store}  />
                            <ClassifyList type='assetType' retrieve='dataAssetType' Store={this.Store} />
                            <ClassifyList type='year' retrieve='dataYear' Store={this.Store} />
                        </View>
                        <View style={styles.movielist}>
                            <MovieList 
                                isRender={MovieData.isRender} 
                                data={MovieData.data} 
                                navigator={navigator} 
                                isEnding={MovieData.isEnding}
                                onEndReached={MovieData.loadMore}
                            />
                        </View>
                    </View>
                    :
                    <Loading />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
  content: {
    flex:1
  },
  classify:{
    backgroundColor:'#fff',
    paddingVertical:5
  },
  classifyitem:{
    height:50,
    alignItems: 'center',
    paddingHorizontal:10,
  },
  classifyel:{
    height:30,
    justifyContent: 'center',
    paddingHorizontal:15,
    borderRadius:15
  },
  classifyActive:{
    backgroundColor:$.COLORS.mainColor,
  },
  classifytext:{
    color:'#474747',
    fontSize:14
  },
  classifytextActive:{
    color:'#fff'
  },
  movielist:{
    flex:1,
    backgroundColor:'#fff',
    paddingTop:10,
    marginTop:7
  }
})