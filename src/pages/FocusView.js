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
  Text
} from 'react-native';

import Appbar from '../compoents/Appbar';
import Touchable from '../compoents/Touchable.js';
import ScrollViewPager from '../compoents/ScrollViewPager';
import FocusLiveListView from './FocusLiveListView';
import FocusMovieListView from '../compoents/MovieList';
import ContentView from './ContentView';

const focus ='收藏'

export default class Focus extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            type:'live',
            dataSource: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            edit:false,
            checkAll:false,
            tabs:''
        };
    }

    componentDidMount(){
        // this.getData();
    }

    edit=()=>{
        this.setState({edit:!this.state.edit});
    }

    checkAll=()=>{
        this.setState({checkAll:!this.state.checkAll});
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
                <ScrollViewPager 
                    bgColor='#fff'
                    tabbarHeight={32}
                    tabbarStyle={{color:'#474747',fontSize:16}}
                    tabbarActiveStyle={{color:$.COLORS.mainColor}}
                    tablineStyle={{backgroundColor:$.COLORS.mainColor,height:2}}
                    tablineHidden={false}
                    navigator={navigator}>
                    <FocusMovieListView navigator={navigator} tablabel="电影"  />
                    <FocusLiveListView navigator={navigator} tablabel="房间" edit={this.state.edit} checkAll={this.state.checkAll}/>
                    <View style={{flex:1}} navigator={navigator} tablabel="文章" ><Touchable><Text>1111</Text></Touchable></View>
                </ScrollViewPager>
                {this.state.edit?
                <View style={styles.edit}>
                    <Text onPress={this.checkAll} style={{textAlign:'center',flex:10,color:'black'}}>{!this.state.checkAll?'全选':'取消'}</Text>
                    <Text style={{textAlign:'center',flex:1,color:'#ECECEC'}}>|</Text>
                    <Text style={{textAlign:'center',flex:10,color:'black'}}>取消关注</Text>
                </View>
                :null
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
        height:'10%',
        backgroundColor:'white',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#ECECEC',
        borderWidth:1/$.PixelRatio,
    }
})