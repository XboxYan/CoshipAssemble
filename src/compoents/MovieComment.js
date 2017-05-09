import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    Image,
    FlatList,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import Loading from './Loading';

const CommentItem = (props) => (
    <View style={styles.commentitem}>
        <View style={styles.headwrap}>
            <Image style={styles.head} source={require('../../img/img01.png')} />
        </View>
        <View style={styles.content}>
            <View style={styles.info}>
                <Text style={styles.name}>一笑而过</Text>
                <Text style={styles.date}>2017-03-30</Text>
            </View>
            <Text style={styles.msg}>好看！想到程道明老艺术家的黑洞，说句实话,人民最关心的是房子，吃的没病。</Text>
        </View>
    </View>
)

export default class extends React.PureComponent {
    data=[
        {key: 'a'}, 
        {key: 'b'},
        {key: 'c'},
        {key: 'd'},
        {key: 'e'},
        {key: 'f'},
        {key: 'g'},
        {key: 'h'},
        {key: 'i'},
        {key: 'j'},
        {key: 'k'},
        {key: 'l'},
        {key: 'm'},
        {key: 'n'},
    ]

    renderItem(item,index){
        return <CommentItem />
    }
    render(){
        const {onCommentLayout,isRender} = this.props;
        if(!isRender){
            return <Loading text='正在加载评论...' size='small' height={200} />
        }
        return(
            <View onLayout={onCommentLayout} style={styles.conwrap}>
                <Text style={styles.title}>评论</Text>
                <Text style={styles.num}>556条评论</Text>
                <TextInput
                    style = {styles.input}
                    selectionColor = {$.COLORS.mainColor}
                    underlineColorAndroid = 'transparent'
                    placeholder = '我来说两句'
                    returnKeyLabel = '评论'
                    placeholderTextColor = '#909090'
                />
                <FlatList
                    style={styles.commentlist}
                    data={this.data}
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
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec'
    },
    title:{
        paddingHorizontal: 10,
        fontSize:16,
        color:'#333',
        paddingBottom: 10,
    },
    num:{
        position:'absolute',
        right:15,
        top:20,
        color:'#9b9b9b',
        fontSize:12,
        zIndex: 10,
    },
    input: {
        fontSize:14,
        height:30,
        paddingHorizontal:15,
        paddingVertical:0,
        borderRadius:15,
        backgroundColor:'#f2f2f2',
        color:'#333',
        marginHorizontal:25,
    },
    commentlist:{
        paddingTop:15
    },
    commentitem:{
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec',
        paddingHorizontal:10,
        paddingVertical:15,
        flexDirection:'row',
        marginTop:10
    },
    headwrap:{
        width:30,
        height:30,
        borderRadius:15,
        marginRight:5,
        overflow:'hidden',
        backgroundColor:'#f1f1f1',
    },
    head:{
        width:30,
        height:30,
        resizeMode:'cover',
        borderRadius:15,
    },
    info:{
        height:30,
        justifyContent: 'center',
    },
    name:{
        fontSize:14,
        color:$.COLORS.mainColor
    },
    date:{
        marginTop:2,
        fontSize:12,
        color:$.COLORS.subColor
    },
    msg:{
        marginTop:15,
        fontSize:13,
        color:'#474747',
        lineHeight:20
    },
    headImage:{
        width:56,
        height:56,
        resizeMode:'cover',
        borderRadius:28,
    },
    castname:{
        fontSize:14,
        color:'#333',
        paddingTop:12
    }
})