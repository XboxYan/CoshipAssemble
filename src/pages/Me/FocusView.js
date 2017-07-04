import React, { Component } from 'react';

import{
  View, 
  StyleSheet,
  TextInput,
  ListView,
  TouchableOpacity,
  Button,
  Image,
  TouchableHighlight,
  Picker,
  ToastAndroid,
  InteractionManager,
  Text
} from 'react-native';

import Appbar from '../../compoents/Appbar';
import Touchable from '../../compoents/Touchable';
import ScrollViewPager from '../../compoents/ScrollViewPager';
import FocusLiveListView from './FocusLiveListView';
import FocusMovieListView from './FocusMovieListView';
import Loading from '../../compoents/Loading';

import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react/native';

const focus ='收藏'

export default class Focus extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            edit:false,
            checkAll:false,
            tabs:'',
            isRender:false
        };
    }

    componentDidMount(){
        InteractionManager.runAfterInteractions(() => {
           this.setState({
               isRender:true
           });
        })
    }

    edit=()=>{
        this.setState({edit:!this.state.edit});
    }

    render(){
        const {navigator,route}=this.props;
        return (
            <View style={styles.container}>  
                <Appbar title={focus} navigator={navigator}>
                    <Touchable style={styles.appBar} onPress={this.edit}>
                        <Text style={styles.appText}>{!this.state.edit?'编辑':'取消'}</Text>
                    </Touchable>
                </Appbar>
                {this.state.isRender?
                    <ScrollViewPager 
                        bgColor='#fff'
                        tabbarHeight={32}
                        tabbarStyle={{color:'#474747',fontSize:16}}
                        tabbarActiveStyle={{color:$.COLORS.mainColor}}
                        tablineStyle={{backgroundColor:$.COLORS.mainColor,height:2}}
                        tablineHidden={false}
                        navigator={navigator}>
                        <FocusMovieListView navigator={navigator} tablabel="电影" edit={this.state.edit} checkAll={this.state.checkAll}/>
                        <FocusLiveListView navigator={navigator} tablabel="房间" edit={this.state.edit} checkAll={this.state.checkAll}/>
                    </ScrollViewPager>
                :
                    <Loading/>
                }
            </View>
        )
    }    
}

const styles= StyleSheet.create({ 
    container:{
        flex:1,
        flexDirection:'column',
        backgroundColor:'white'
    },
    appBar:{
        marginRight:20,
        marginTop:14,
        marginBottom:14
    },
    edit:{
        height:46,
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#ECECEC',
        borderWidth:1/$.PixelRatio,
    }
})