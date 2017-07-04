import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    Image,
    RefreshControl,
    ListView,
    ToastAndroid,
    InteractionManager,
    TouchableWithoutFeedback
} from 'react-native';

import SmartBanner from './Smart/SmartBanner';
import SmartList from './Smart/SmartList';
import SmartVrList from './Smart/SmartVrList';
import Toast from 'react-native-root-toast';
import VrListView from './Smart/VrListView'
import SecurityLiveView from './Smart/SecurityLiveView'

import { observable, action, computed } from 'mobx';
import fetchData from '../util/Fetch';

import Appbar from '../compoents/Appbar';
import moment from 'moment';
import 'moment/locale/zh-cn';

const TIME_FORMAT = 'YYYYMMDDHHmmss';

const title = '智慧生活';

const Icon0 = () => <Image style={styles.ico} source={require('../../img/smart_icon_default.png')} />;
const Icon1 = () => <Image style={styles.ico} source={require('../../img/smart_icon1.png')} />;
const Icon2 = () => <Image style={styles.ico} source={require('../../img/smart_icon_default.png')} />;
const Icon3 = () => <Image style={styles.ico} source={require('../../img/smart_icon3.png')} />;
const Icon4 = () => <Image style={styles.ico} source={require('../../img/smart_icon4.png')} />;
const Icon5 = () => <Image style={styles.ico} source={require('../../img/smart_icon5.png')} />;
const Icon6 = () => <Image style={styles.ico} source={require('../../img/smart_icon6.png')} />;
const Icon7 = () => <Image style={styles.ico} source={require('../../img/smart_icon_default.png')} />;
const Icon8 = () => <Image style={styles.ico} source={require('../../img/smart_icon8.png')} />;

const Icon9 = () => <Image style={styles.horizontalIcon} source={require('../../img/smart_safety1.png')} />;
const Icon10 = () => <Image style={styles.horizontalIcon} source={require('../../img/smart_safety2.png')} />;
const Icon11 = () => <Image style={styles.horizontalIcon} source={require('../../img/smart_vr1.png')} />;
const Icon12 = () => <Image style={styles.horizontalIcon} source={require('../../img/smart_vr2.png')} />;

export default class Community extends React.PureComponent {

    state = {
        BannerList: [],
        ColumnList: [],
        SafetyList: [],
        VrList: [],
        weatherData:[],
        initialPosition: "unknown",
        isRefreshingBanner:true,
        isRefreshingColumn:true,
        isRefreshingVrList:true
    }

    fetchDataBanner = () => {
        fetch(BASE_SMART+'json/top_content_list.jspx?channelIds[]=376&topLevel=0&needCount=1&count=10')
            .then((response) => response.json())
            .then((BannerList) => {
                if (BannerList.length > 0) {
                    this.setState({
                        BannerList: BannerList,
                        isRefreshingBanner:false
                    });
                }
            })
            .catch((error) => {
                alert(error);
            });

    }

    getColumnData() {
        fetch(BASE_SMART+'json/channel_list.jspx', {
            method: 'post',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: 'parentId=' + '376' + '&siteId=1&hasContentOnly=true&first=0&count=10'
        })
            .then((response) => response.json())
            .then((ColumnList) => {

                if (ColumnList.length > 0) {

                    this.setState({
                        ColumnList: ColumnList,
                        isRefreshingColumn:false,
                    });
                }
            })
            .catch((error) => {
                alert(error);
            });
    }

    fetchVrList = () => {
        this.setState({
            isRefreshingVrList:false,
            VrList: [{ id: 0, icon: <Icon11 /> }, { id: 1, icon: <Icon12 /> },
            { id: 2, icon: <Icon9 /> }, { id: 3, icon: <Icon10 /> },
            ],
        })
    }

    getWheatherData = () => {
        // navigator.geolocation.getCurrentPosition(
        //     (position) => {
        //         var initialPosition = JSON.stringify(position);
        //         this.setState({ initialPosition });
        //         alert(initialPosition);
        //     },
        //     (error) => alert(error.message),
        //     { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 }

        // );

        fetch(BASE_SMART+'baseAjaxServiceAct/weatherAjax.jspx?cityX=114.31&cityY=30.52')
            .then((response) => response.json())
            .then((object) => {

                if (object.status == 1) {
                    this.setState({
                        weatherData:object.retInfo
                    });
                }
                else {
                    Toast.show('请求天气失败!');
                }
            })
            .catch((error) => {
                Toast.show('请求天气失败!');
                alert(error);
            });
    }

    enterVrArea = () => {
        this.props.navigator.push({ name: VrListView })
    }

    enterSecurityArea = () => {
        this.props.navigator.push({ name: SecurityLiveView })
    }


    onRefresh = () => {
        this.fetchDataBanner();
        this.getColumnData();
        this.fetchVrList();
        this.getWheatherData();
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.fetchDataBanner();
            this.getColumnData();
            this.fetchVrList();
            this.getWheatherData();
        })
    }

    render() {

        //当前时间
        const nowTime = moment().format("D");
        const singular = '1、3、5、7、9'
        const even = '0、2、4、6、8'
        const lastNum = nowTime % 2 > 0 ? singular : even

        const { navigator } = this.props;
        const isRefreshing = this.state.isRefreshingBanner||this.state.isRefreshingColumn||this.state.isRefreshingVrList;

        const weather = this.state.weatherData.cityname ? '明日 '+ this.state.weatherData.cityname + ' ' + this.state.weatherData.stateDetailed  + ' ' + this.state.weatherData.tem2 + ' - '+ this.state.weatherData.tem1 + '℃':'加载中...';
        return (
            <View style={styles.container}>
                <Appbar title={title} isBack={false} />
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={this.onRefresh}
                            tintColor={$.COLORS.mainColor}
                            title="Loading..."
                            titleColor="#666"
                            colors={[$.COLORS.mainColor]}
                            progressBackgroundColor="#fff"
                        />
                    }
                    >
                    <SmartBanner isRender={!this.state.isRefreshingBanner} imgList={this.state.BannerList} navigator={navigator} />
                    <View style={styles.textView}>
                        <Text style={styles.weathertext}>{weather}</Text>
                    </View>
                    <View style={styles.textView}>
                        <Text style={styles.weathertext}>今日 长江大桥、江汉一桥限行尾号为：{lastNum}</Text>
                    </View>
                    <SmartList data={this.state.ColumnList} navigator={navigator} />

                    <View style={styles.safetyHeader}>
                        <Image style={styles.safetyType} source={require('../../img/smart_safety.png')} />
                        <Text style={styles.safetyText} >安防监控</Text>
                    </View>
                    <SmartVrList data={this.state.VrList} onPress={this.enterSecurityArea} navigator={navigator} />
                    <View style={styles.safetyHeader}>
                        <Image style={styles.safetyType} source={require('../../img/smart_vr.png')} />
                        <Text style={styles.safetyText} >VR专区</Text>
                    </View>
                    <SmartVrList data={this.state.VrList} onPress={this.enterVrArea} navigator={navigator} />
                </ScrollView>
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
    weathertext: {
        marginLeft: 10,
        fontSize: 14,
        color: '#333',
    },

    // 安防
    safetyHeader: {
        marginTop: 7,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        height: 48,
        paddingHorizontal: 10,
        flexDirection: 'row'
    },
    safetyType: {
        width: 16,
        height: 16
    },
    safetyText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 3
    },
    ico: {
        width: 40,
        height: 40,
    },
    horizontalIcon: {
        width: '100%',
        flex: 1,
        resizeMode: 'cover'
    }

});
