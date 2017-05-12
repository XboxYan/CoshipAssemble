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
import OrderTrueView from './OrderTrueView';
import OrderFalseView from './OrderFalseView';
import FocusMovieListView from '../compoents/MovieList';
import ContentView from './ContentView';

const order ='预约'

export default class Order extends React.Component{

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
                <Appbar title={order} navigator={navigator}>
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
                    <OrderTrueView navigator={navigator} tablabel="已预约" edit={this.state.edit} checkAll={this.state.checkAll} />
                    <OrderFalseView navigator={navigator} tablabel="已结束" edit={this.state.edit} checkAll={this.state.checkAll}/>
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