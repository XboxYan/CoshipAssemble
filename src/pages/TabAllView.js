import React, { PureComponent } from 'react';
import {
  StyleSheet,
  ScrollView,
  InteractionManager,
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Appbar from '../compoents/Appbar';
import Loading from '../compoents/Loading';
import Touchable from '../compoents/Touchable';

class GridItem extends PureComponent {
    handle = () => {
        const {navigator,onSetPage,pageIndex} = this.props;
        navigator.pop();
        onSetPage(pageIndex);
    }
    render(){
        const {title} = this.props;
        return(
            <Touchable onPress={this.handle} style={styles.griditem}>
                <Icon size={30} name='dashboard' color='orangered' />
                <Text numberOfLines={1} style={styles.gridtext}>{title}</Text>
            </Touchable>
        )
    }
}

export default class TabAllView extends React.PureComponent {
    state = {
        isRender:false
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isRender:true
            })
        })
    }
    render(){
        const {navigator,route}=this.props;
        const {isRender}=this.state;
        return (
            <View style={styles.content}>
                <Appbar title="影视分类" navigator={navigator} />
                {
                    true?
                    <ScrollView style={styles.content}>
                        <View style={styles.gridcon}>
                        {
                            route.tablabel.map((el,i)=>(
                                <GridItem key={i} navigator={navigator} onSetPage={route.onSetPage} pageIndex={i} title={el} />
                            ))
                        }
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
    flex:1,
    backgroundColor:'#f1f1f1'
  },
  gridcon:{
    backgroundColor:'#fff',
    flexDirection:'row',
    flexWrap:'wrap',
    marginTop:10
  },
  griditem:{
    width:$.WIDTH/4,
    height:$.WIDTH/4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal:5
  },
  gridtext:{
    color:'#999',
    fontSize:14,
    marginTop:5
  }
})