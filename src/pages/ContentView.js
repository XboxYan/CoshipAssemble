import React, { PureComponent } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  InteractionManager,
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MovieList from '../compoents/MovieList';
import Banner from '../compoents/Banner';
import MovieSortView from './MovieSortView';

const MovieMore = (props) => (
    <View style={styles.sectionHeader}>
        <Image style={styles.sectionType} source={require('../../img/icon_hot.png')} />
        <Text style={styles.sectionText} >热门</Text>
        <TouchableOpacity activeOpacity={.8} style={styles.more}>
            <Text style={styles.moretext}>更多</Text>
            <Icon name='keyboard-arrow-right' size={24} color={$.COLORS.subColor} />
        </TouchableOpacity>
    </View>
)

const MovieSection = (props) => (
    <View style={styles.section}>
        <MovieMore />
        <MovieList />
    </View>
)

const TagEl = (props) => (
    <TouchableOpacity onPress={props.onPress} activeOpacity={.8} style={styles.tagel}>
        <Text style={styles.tageltext}>{props.text}</Text>
    </TouchableOpacity>
)

class TagList extends PureComponent {
    handle = () => {
        const {navigator} = this.props;
        navigator.push({
            name: MovieSortView
        })
    }
    render(){
        return(
            <View style={styles.sortlist}>
                <TagEl onPress={this.handle} text="动作" />
                <TagEl onPress={this.handle} text="武侠" />
                <TagEl onPress={this.handle} text="犯罪" />
                <TagEl onPress={this.handle} text="科幻" />
                <TagEl onPress={this.handle} text="战争" />
                <TagEl onPress={this.handle} text="警匪" />
            </View>
        )
    }
}


export default class Content extends PureComponent {
    state = {
        isRender:false,
        isRefreshing:false
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isRender:true
            })
        })
    }
    onRefresh = ()=>{

    }
    render(){
        const {navigator,route}=this.props;
        const {isRender}=this.state;
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
                <Banner navigator={navigator} />
                <TagList navigator={navigator} />
                <MovieSection navigator={navigator} />
                <MovieSection navigator={navigator} />
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    section:{
        marginTop:7,
        backgroundColor:'#fff'
    },
    sectionHeader:{
        alignItems: 'center',
        height:48,
        paddingHorizontal:10,
        flexDirection:'row'
    },
    sectionType:{
        width:16,
        height:16
    },
    sectionText:{
        flex:1,
        fontSize:16,
        color:'#333',
        marginLeft:3
    },
    more:{
        alignItems: 'center',
        height:48,
        flexDirection:'row'
    },
    moretext:{
        fontSize:14,
        color:$.COLORS.subColor
    },
    sortlist:{
        backgroundColor:'#fff',
        flexDirection:'row',
        flexWrap:'wrap',
        padding:10,
    },
    tagel:{
        paddingHorizontal:20,
        height:32,
        backgroundColor:'#fafafa',
        borderWidth:1/$.PixelRatio,
        justifyContent:'center',
        borderColor:'#ddd',
        borderRadius:16,
        marginHorizontal:10,
        marginVertical:5
    },
    tageltext:{
        fontSize:12,
        color:'#717171'
    }
})