import React, { PureComponent } from 'react';
import {
    StyleSheet,
    InteractionManager,
    View,
} from 'react-native';

import Loading from '../../compoents/Loading';
import Appbar from '../../compoents/Appbar';
import MovieList from '../../compoents/MovieList';
import fetchData from '../../util/Fetch';

export default class extends PureComponent {
    state = {
        isRender:false,
        movieData: [],
        movieRender:false
    }

    _fetchMovie = (assetId) => {
        fetchData('GetFolderContents',{
            par:{
                assetId:assetId,
                includeSelectableItem:'Y',
                maxItems:1000
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
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isRender:true
            })
            const { assetId } = this.props.route;
            this._fetchMovie(assetId);
        })
    }
    render(){
        const {navigator,route}=this.props;
        const {isRender,movieData,movieRender}=this.state;
        return (
            <View style={styles.container}>
                <Appbar title={route.title} navigator={navigator} />
                {
                    isRender?
                    <MovieList data={movieData} isRender={movieRender} navigator={navigator} />
                    :
                    <Loading />
                } 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#fff'
    },
})