import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Video from 'react-native-vlc';
import Banner from '../compoents/Banner';

export default class Community extends React.PureComponent {
    render(){
        //let uri = "rtsp://10.9.212.224:554/stream2";
        let uri = "http://10.9.219.22:8099/vod/201003170038,TWSX1463723577361555.m3u8";
        return (
            <Video 
                source={{uri: uri}}
                playInBackground={false}
                paused={false}
                resizeMode="cover"
                style={styles.backgroundVideo}
            />
        )
    }
}

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});