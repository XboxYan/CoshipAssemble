import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    FlatList,
    ScrollView,
    InteractionManager,
    TouchableOpacity,
    View,
} from 'react-native';

import ScrollViewPager from './ScrollViewPager';
import Loading from './Loading';
import Icon from 'react-native-vector-icons/MaterialIcons';

const EpisItem = (props) => (
    <TouchableOpacity style={styles.episitem} activeOpacity={.8}>
        <Text style={styles.episnum}>{ props.item.num+'' }</Text>
    </TouchableOpacity>
)

const EpisList = (props) => (
    <ScrollView style={styles.content} contentContainerStyle={styles.episListwrap} >
        {
            props.data.map((el,i)=>(
                <EpisItem item={el} key={i} />
            ))
        }
    </ScrollView>
)

class EpisDetail extends React.PureComponent {

    state = {
        isRender:false,
        data:[]
    }

    chunk = (data,groupByNum)=> Array.apply(null, {
            length: Math.ceil(data.length / groupByNum)
        }).map((x, i) => {
            return data.slice(i * groupByNum, (i + 1) * groupByNum);
        })
    

    onBack = () => {
        const { navigator } = this.props;
        navigator.pop();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            let data = [...this.props.route.data];
            let tablabels = this.chunk(data,50);
            this.setState({
                isRender:true,
                data:tablabels
            })
        })
    }

    render(){
        const { isRender,data } = this.state;
        return(
            <View style={[styles.conwrap,styles.content,styles.padBottomFix]}>
                <Text style={styles.title}>剧集</Text>
                {
                    isRender?
                    <ScrollViewPager 
                        bgColor='#fff'
                        tabbarHeight={34}
                        tabbarStyle={{color:'#474747',fontSize:16}}
                        tabbarActiveStyle={{color:$.COLORS.mainColor}}
                        tablineStyle={{backgroundColor:$.COLORS.mainColor,height:2}}
                        tablineHidden={false}>
                            {
                                data.map((el,i)=>{
                                    let start = data[i][0].num;
                                    let len = data[i].length;
                                    let end = data[i][len-1].num;
                                    return <EpisList key={i} data={el} tablabel={start+'-'+end} />
                                })
                            }
                    </ScrollViewPager>
                    :
                    <Loading/>
                }
                <TouchableOpacity onPress={this.onBack} style={styles.slidebtn} activeOpacity={.8}>
                    <Icon name='clear' size={24} color={$.COLORS.subColor} />
                </TouchableOpacity>
            </View>
        )
    }
}

export default class extends React.PureComponent {

    onShowMore = () => {
        const {navigator,data} = this.props;
        navigator.push({name:EpisDetail,data:data});
    }

    renderItem =({item,index})=>{
        return <EpisItem item={item} />
    }

    render(){
        const {data} = this.props;
        return(
            <View style={styles.conwrap}>
                <Text style={styles.title}>剧集</Text>
                <TouchableOpacity onPress={this.onShowMore} style={styles.epistotal} activeOpacity={.8}>
                    <Text style={styles.totaltext}>更新至49集/共{data.length+''}集</Text><Icon name='keyboard-arrow-right' size={20} color={$.COLORS.subColor} />
                </TouchableOpacity>
                <FlatList
                    style={styles.epislist}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    getItemLayout={(data, index) => ( {length: 70, offset: 70 * index, index} )}
                    data={data}
                    renderItem={this.renderItem}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content:{
        flex:1
    },
    conwrap: {
        paddingTop:20,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec'
    },
    padBottomFix:{
        paddingBottom:0,
    },
    epislist:{
        paddingHorizontal: 5,
    },
    episListwrap:{
        flexDirection:'row',
        paddingVertical: 10,
        paddingHorizontal: 5,
        flexWrap:'wrap',
    },
    episitem:{
        width:30,
        height:30,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical:10,
        marginHorizontal:20,
        borderRadius:15,
        backgroundColor:'#f1f1f1'
    },
    episitemActive:{
        backgroundColor:$.COLORS.mainColor
    },
    episnum:{
        fontSize:16,
        color:'#333'
    },
    episnumActive:{
        color:'#fff'
    },
    epistotal:{
        flexDirection:'row',
        alignItems: 'center',
        position:'absolute',
        height:48,
        top:0,
        right:0
    },
    totaltext:{
        fontSize:12,
        color:'#9b9b9b',
    },
    title:{
        paddingHorizontal: 10,
        fontSize:16,
        color:'#333',
        paddingBottom: 10,
    },
    slidebtn:{
        position:'absolute',
        width:48,
        height:48,
        right:0,
        top:0,
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
})