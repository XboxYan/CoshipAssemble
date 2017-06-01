import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    Image,
    ListView,
    TouchableWithoutFeedback
} from 'react-native';

import SmartBanner from './Smart/SmartBanner';
import SmartList from './Smart/SmartList';

import { observable, action, computed } from 'mobx';
import fetchData from '../util/Fetch';

import Appbar from '../compoents/Appbar';


const title = '智慧生活';

const Icon1 = () => <Image style={styles.ico} source={require('../../img/smart_icon1.png')} />;
const Icon2 = () => <Image style={styles.ico} source={require('../../img/smart_icon_default.png')} />;
const Icon3 = () => <Image style={styles.ico} source={require('../../img/smart_icon3.png')} />;
const Icon4 = () => <Image style={styles.ico} source={require('../../img/smart_icon4.png')} />;
const Icon5 = () => <Image style={styles.ico} source={require('../../img/smart_icon5.png')} />;
const Icon6 = () => <Image style={styles.ico} source={require('../../img/smart_icon6.png')} />;
const Icon7 = () => <Image style={styles.ico} source={require('../../img/smart_icon_default.png')} />;
const Icon8 = () => <Image style={styles.ico} source={require('../../img/smart_icon8.png')} />;

export default class Community extends React.PureComponent {
    state = {
        BannerList: [],
        ColumnList: [],
        SafetyList: []
    }
    fetchDataBanner = () => {
        // fetchData('GetAssociatedFolderContents', {
        //     par: {
        //         quickId: this.assetId
        //     }
        // }, (data) => {
        //     if (data.totalResults > 0) {
        //         this.setState({
        //             BannerList: data.selectableItem
        //         })
        //     }
        // })
        this.setState({
            BannerList: [{ posterUrl: "http://10.9.219.23:8080/ott-poster/upload/poster/70210ec2-e1a9-4a3d-ada9-901a3c855e42.jpg" }
                , { posterUrl: "http://10.9.219.23:8080/ott-poster/upload/poster/1451c3f7-c115-405e-bc6e-2c371a2f4fd9.jpg" }
                , { posterUrl: "http://10.9.219.23:8080/ott-poster/upload/poster/c9852f97-b27e-4c0f-901f-26afba7fe760.jpg" }],
        })
    }

    fetchDataColumn = () => {
        this.setState({
            ColumnList: [{columnId: 1, columnName: "政务", columnIcon: <Icon1 /> }, { columnId: 2,columnName: "咨询", columnIcon: <Icon2 /> },
            { columnId: 3,columnName: "党教", columnIcon: <Icon3 /> }, {columnId: 4, columnName: "文化", columnIcon: <Icon4 /> },
            { columnId: 5,columnName: "医疗", columnIcon: <Icon5 /> }, { columnId: 6,columnName: "教育", columnIcon: <Icon6 /> },
            { columnId: 7,columnName: "理财", columnIcon: <Icon7 /> }, { columnId: 8,columnName: "更多", columnIcon: <Icon8 /> },
            ],
            // ColumnList: [{ columnName: "政务", }, { columnName: "咨询" }
            //             ,{ columnName: "党教" }, { columnName: "文化" }
            //             ,{ columnName: "医疗" }, { columnName: "教育" }
            //             ,{ columnName: "理财" }, { columnName: "更多" }
            //             ],
            // SafetyList: [{}, {}]
        })
    }
    componentDidMount() {
        this.fetchDataBanner();
        this.fetchDataColumn();
    }

    render() {
        return (
            <View style={styles.container}>
                <Appbar title={title} isBack={false} />
                <ScrollView >
                    <SmartBanner imgList={this.state.BannerList} />
                    <View style={styles.textView}>
                        <Text style={styles.weathertext}>明日 武汉 多云转晴 19 - 29℃</Text>
                    </View>
                    <View style={styles.textView}>
                        <Text style={styles.weathertext}>今日 长江大桥、江汉一桥限行尾号为：0、2、4、8</Text>
                    </View>
                    <SmartList data={this.state.ColumnList} />

                    <View style={styles.safetyHeader}>
                        <Image style={styles.safetyType} source={require('../../img/smart_safety.png')} />
                        <Text style={styles.safetyText} >安防</Text>
                    </View>
                </ScrollView>
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
    weathertext: {
        marginLeft: 10,
        fontSize: 14,
        color: $.COLORS.subColor,
    },

    // 一级栏目
    shortcutList: {
        height: 170,
        marginTop: 5,
        justifyContent: 'space-around',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    shortcutRow: {
        justifyContent: 'center',
        padding: 5,
        margin: 3,
        width: 85,
        height: 85,
        backgroundColor: '#F6F6F6',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#CCC'
    },
    shortcutThumb: {
        width: 45,
        height: 45
    },
    shortcutText: {
        flex: 1,
        marginTop: 5,
        fontWeight: 'bold'
    },

    listStyle: {
        flexDirection: 'row', //改变ListView的主轴方向
        flexWrap: 'wrap', //换行
    },
    itemViewStyle: {
        alignItems: 'center', //这里要注意，如果每个Item都在外层套了一个 Touchable的时候，一定要设置Touchable的宽高
        // width: width / 3,
        height: 100
    },
    itemIconStyle: {
        width: 60,
        height: 60
    },
    itemTitleStyle: {
        marginTop: 8
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
    }

});