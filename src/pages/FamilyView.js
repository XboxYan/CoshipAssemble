import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Appbar from '../compoents/Appbar';

export default class extends React.PureComponent {
    render(){
        return (
            <View style={styles.container}>
                <Appbar title="智能家居" isBack={false} />
            </View >
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