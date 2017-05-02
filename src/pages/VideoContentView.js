import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  InteractionManager,
  View,
} from 'react-native';

import Appbar from '../compoents/Appbar';
import Video from '../compoents/Video';

export default class extends React.PureComponent {
    state = {
        isRender:false,
    }
    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.setState({
                isRender:true,
                playUri:'http://v.yoai.com/femme_tampon_tutorial.mp4'
            })
        })
    }
    render(){
        const {navigator,route}=this.props;
        const {isRender,playUri}=this.state;
        return (
            <View style={styles.content}>
                <Appbar title="春娇救志明" navigator={navigator} />
                {
                    isRender?
                    <Video playUri={playUri} />
                    :null
                }
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
  content: {
    flex:1
  },
})