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

import Appbar from '../compoents/Appbar';
import Loading from '../compoents/Loading';
import MovieList from '../compoents/MovieList';

const ClassifyItem = (props) => (
    <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.classifyitem}>
        {
            props.data.map((el,i)=>(
                <TouchableOpacity onPress={()=>props.handleSelecet(props.pos,i)} key={i} activeOpacity={.8} style={[styles.classifyel,props.selected===i&&styles.classifyActive]}>
                    <Text style={[styles.classifytext,props.selected===i&&styles.classifytextActive]}>{el}</Text>
                </TouchableOpacity>
            ))
        }
    </ScrollView>
)

const Classify = (props) => (
    <View style={styles.classify}>
        {
            props.data.map((el,i)=>(
                <ClassifyItem data={el} selected={props.selected[i]} handleSelecet={props.handleSelecet} pos={i} key={i} />
            ))
        }
    </View>
)

export default class MovieSort extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isRender:false,
            data:[],
            selected:[0,0,0]
        }
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    data = [
        ['全部','香港','美国','大陆','韩国'],
        ['全部','武侠','警匪','犯罪','科幻','战争'],
        ['全部','2017','2016','2015','2014','2013','2012','2011','2010']
    ]
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isRender:true,
                data:this.data
            })
            //LayoutAnimation.spring();
        })
    }
    handleSelecet = (postion,index) => {
        let selected = [...this.state.selected];
        selected[postion] = index;
        this.setState({selected});
    }
    render(){
        const {navigator,route}=this.props;
        const {isRender,data,selected}=this.state;
        return (
            <View style={styles.content}>
                <Appbar title="电影" navigator={navigator} />
                {
                    isRender?
                    <ScrollView style={styles.content}>
                        <Classify data={data} selected={selected} handleSelecet={this.handleSelecet} />
                        <View style={styles.movielist}>
                            <MovieList />
                        </View>
                    </ScrollView>
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