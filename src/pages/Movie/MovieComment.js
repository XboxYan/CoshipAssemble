import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    FlatList,
    TextInput,
    ActivityIndicator,
    InteractionManager,
    UIManager,
    LayoutAnimation,
    TouchableOpacity,
    View,
} from 'react-native';

import Image from '../../compoents/Image';
import LoginStore from '../../util/LoginStore';
import fetchData from '../../util/Fetch';

import { observer } from 'mobx-react/native';
import { observable,computed,action } from 'mobx';
import LoginView from '../Me/LoginView';
import Loading from '../../compoents/Loading';
import Touchable from '../../compoents/Touchable';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CommentItem = (props) => (
    <View style={styles.commentitem}>
        <View style={styles.headwrap}>
            <Image 
                style={styles.head}
                defaultSource={require('../../../img/actor_moren.png')}
                source={{uri:Base+props.item.logo}} />
        </View>
        <View style={styles.content}>
            <View style={styles.info}>
                <Text style={styles.name}>{props.item.userName||props.item.userCode}</Text>
                <Text style={styles.date}>{props.item.creatTime}</Text>
            </View>
            <Text style={styles.msg}>{props.item.comment}</Text>
        </View>
    </View>
)

const LoadView = (props) => (
    <View style={styles.loadview}>
		{
			props.isEnding?
			<View style={styles.loadmore}>
				<Text style={styles.loadtext}>没有更多了 </Text>
			</View>
			:
			<View style={styles.loadmore}>
				<ActivityIndicator size='small' color={$.COLORS.mainColor} />
				<Text style={styles.loadtext}>正在加载评论...</Text>
			</View>
		}
    </View>
)

const CommentEmpty = () => (
	<View style={styles.flexcon}>
		<Text>没有找到评论！</Text>
	</View>
)

@observer
class CommentList extends PureComponent {

    renderFooter = () => {
		const { data } = this.props;
		if(data.length>0){
			const { onEndReached,isEnding=false } = this.props;
			if(onEndReached){
				return <LoadView isEnding={isEnding} />;
			}else{
				return null;
			}
		}else{
			return <CommentEmpty />;
		}
	}

    renderItem({item,index}){
        return <CommentItem item={item} />
    }
    
    render(){
        const { data, isRender,onEndReached=()=>{} } = this.props;
        if (!isRender) {
			return <Loading text='正在加载评论...' size='small' height={100} />
		}
        return (
            <FlatList
                removeClippedSubviews={__ANDROID__}
                style={styles.commentlist}
                keyExtractor={(item)=>item.creatTime}
                ListFooterComponent={this.renderFooter}
                onEndReached={onEndReached}
				onEndReachedThreshold={0.1}
                data={data}
                renderItem={this.renderItem}
            />
        )
    }
}

@observer
class CommentDetail extends PureComponent {

    objID = '';

    providerId = '';

    @observable
    pageIndex = 1;

    @observable
    pageSize = 10;

    @observable
    data = [];

    @observable
    isRender = false;

    @observable
    size = 0;

    @computed
    get isEnding(){
        return this.size === this.data.length;
    }

    @action
    loadMore = () => {
        if(!this.isEnding){
            this.pageIndex = this.pageIndex+1;
            this._fetchData();
        }
    }

    onBack = () => {
        const { navigator } = this.props;
        navigator.pop();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const { Store } = this.props.route;
            this.objID = Store.TVassetId||Store.assetId;
            this.providerId = Store.StoreTv.providerId||Store.StoreInfo.providerId;
            this._fetchData();
        })
    }

    _fetchData = () => {
        fetchData('GetComments',{
            par:{
                objID:this.objID,
                providerId:this.providerId,
                startAt:this.pageIndex,
                maxItems:this.pageSize
            }
        },(data)=>{
            if(data.ret==='0'){
                this.isRender = true;
                this.size = Number(data.totolCount);
                this.data = [...this.data,...data.commitList];
            }
        })
    }

    render() {
        return (
            <View style={[styles.conwrap,styles.content]}>
                <Text style={styles.title}>全部评论({this.size}){this.startAt}</Text>
                <CommentList 
                    isRender={this.isRender} 
                    onEndReached={this.loadMore}
                    isEnding={this.isEnding}
                    data={this.data} />
                <TouchableOpacity onPress={this.onBack} style={styles.slidebtn} activeOpacity={.8}>
                    <Icon name='clear' size={24} color={$.COLORS.subColor} />
                </TouchableOpacity>
            </View>
        )
    }
}

@observer
export default class extends PureComponent {

    constructor(props) {
        super(props);
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    @observable text = '';
    
    componentWillUpdate() {
        //LayoutAnimation.spring();
    }

    onSubmit = () => {
        const {Store,Navigator} = this.props;
        if(LoginStore.loginState){
            if(this.text){
                Store.StoreComment.addComment(this.text);
                this.text = '';
            }
        }else{
            Navigator.push({name:LoginView});
        }
    }

    onEdit = (text) => {
        this.text = text;
    }

    onShowMore = () => {
        const {navigator,Store} = this.props;
        navigator.push({name:CommentDetail,Store:Store});
    }

    render(){
        const {onCommentLayout,Store} = this.props;
        const isRender = Store.isRender && Store.StoreComment.isRender;
        const size = Store.StoreComment.size;
        return(
            <View onLayout={onCommentLayout} style={styles.conwrap}>
                <Text style={styles.title}>评论</Text>
                <TextInput
                    style = {styles.input}
                    value = {this.text}
                    selectionColor = {$.COLORS.mainColor}
                    underlineColorAndroid = 'transparent'
                    onSubmitEditing = {this.onSubmit}
                    onChangeText = {this.onEdit}
                    placeholder = '我来说两句'
                    returnKeyLabel = '评论'
                    placeholderTextColor = '#909090'
                />
                <CommentList isRender={isRender} data={Store.StoreComment.data} />
                {
                    size>10&&
                    <Touchable onPress={this.onShowMore} style={styles.commentmore}>
                        <Text style={styles.commentmoretext}>查看全部评论</Text>
                    </Touchable>
                }
                <TouchableOpacity disabled={size<10} onPress={this.onShowMore} style={styles.epistotal} activeOpacity={.8}>
                    <Text style={styles.totaltext}>{size}条评论</Text>
                    <Icon name='keyboard-arrow-right' size={size>10?20:10} color={size>10?$.COLORS.subColor:'transparent'} />
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content:{
        flex:1
    },
    conwrap: {
        paddingTop: 20,
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
        marginBottom:25
    },
    commentlist:{
        paddingTop:0
    },
    commentitem:{
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec',
        paddingHorizontal:10,
        paddingVertical:15,
        flexDirection:'row',
        marginBottom:10
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
    },
    flexcon:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
        paddingBottom:20
	},
	loadview:{
		padding:15,
		alignItems: 'center',
	},
	loadtext:{
		color:'#ccc',
		fontSize:14,
		paddingHorizontal:5
	},
	loadmore:{
		flexDirection:'row',
		justifyContent: 'center',
	},
    commentmore:{
        borderTopWidth: 1 / $.PixelRatio,
        borderTopColor: '#ececec',
        flex:1,
        justifyContent: 'center',
		alignItems: 'center',
        height:50
    },
    commentmoretext:{
        color:$.COLORS.mainColor,
        fontSize:14
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
    epistotal: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        height: 48,
        top: 0,
        right: 0
    },
    totaltext: {
        fontSize: 12,
        color: '#9b9b9b',
    },
})