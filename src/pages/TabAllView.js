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
        onSetPage(pageIndex);
        navigator.pop();
    }
    render(){
        const {title} = this.props;
        return(
            <Touchable onPress={this.handle} style={styles.griditem}>
                <Icon size={24} name='dashboard' color='#fff' />
                <Text>{title}</Text>
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
                    isRender?
                    <ScrollView style={styles.content}>
                        {
                            route.tablabel.map((el,i)=>(
                                <GridItem key={i} navigator={navigator} onSetPage={route.onSetPage} pageIndex={i} title={el} />
                            ))
                        }
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
  griditem:{

  }
})