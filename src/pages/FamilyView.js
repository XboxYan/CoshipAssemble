import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Appbar from '../compoents/Appbar';
import InteractiveLiveListView from './InteractiveLive/InteractiveLiveListView'

export default class extends React.PureComponent {

    render(){
        const {navigator} = this.props;
        return (
            <View style={styles.container}>
                <Appbar title="互动直播" isBack={false} />
                <InteractiveLiveListView navigator={navigator}/>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textView: {
        height: 48,
        marginBottom: 2 / $.PixelRatio,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    

});