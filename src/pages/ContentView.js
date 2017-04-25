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
                <Banner />
                <MovieSection />
                <MovieSection />
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
    }
})