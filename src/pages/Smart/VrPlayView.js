/**
 * Created by 909753 on 2017/6/2.
 */
import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    StatusBar,
    Image,
    ScrollView,
    FlatList,
    UIManager,
    LayoutAnimation,
    InteractionManager,
    WebView,
    View,
} from 'react-native';

import Appbar from '../../compoents/Appbar';
import Loading from '../../compoents/Loading';

const url = "http://10.9.212.113:8080/webvr/vr.html?url=http://10.9.212.113:8080/webvr/vrimg/getDetail.json";

export default class extends PureComponent{

    render() {
        const {navigator,route} = this.props;
        const {resourceName,resourceId}=route;
        const url="http://10.9.216.1:8000/SPSmartCMS/webvr/vr.html?url=http://10.9.216.1:8000/SPSmartCMS/vrAdmin/v_getInitData.jspx?id="+resourceId
        return (
            <View style={styles.container}>
                <Appbar title={resourceName} navigator={navigator}/>
                <WebView
                    style={{width:$.WIDTH,flex:1,backgroundColor:'white'}}
                    source={{uri:url,method: 'GET'}}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    renderLoading={()=>{return(<Loading/>)}}
                    startInLoadingState={true}
                    scalesPageToFit={false}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
});