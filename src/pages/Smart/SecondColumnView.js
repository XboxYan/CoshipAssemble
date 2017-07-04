import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    Image,
    ListView,
    InteractionManager,
    TouchableWithoutFeedback
} from 'react-native';

import SmartBanner from './SmartBanner';
import SecColumnList from './SecColumnList';

import { observable, action, computed } from 'mobx';
import fetchData from '../../util/Fetch';

import Appbar from '../../compoents/Appbar';
import Touchable from '../../compoents/Touchable';
import Loading from '../../compoents/Loading';

export default class extends PureComponent {

    state = {
        isRender: false,
        isColumnListRender: false,
        BannerList: [],
        ColumnList: [],
    }
    fetchDataBanner = (id) => {
        fetch(BASE_SMART+'json/top_content_list.jspx?channelIds[]=' + id)
            .then((response) => response.json())
            .then((BannerList) => {
                if (BannerList.length > 0) {
                    this.setState({
                        isRender: true,
                        BannerList: BannerList,
                    });
                }
            })
            .catch((error) => {
                alert(error);
            });
    }

    getColumnData(id) {
        fetch(BASE_SMART+'json/channel_list.jspx', {
            method: 'post',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: 'parentId=' + id + '&siteId=1&hasContentOnly=true&first=0'
        })
            .then((response) => response.json())
            .then((ColumnList) => {
                this.setState({
                    ColumnList: ColumnList,
                    isColumnListRender: true,
                });
            })
            .catch((error) => {
                alert(error);
            });
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            const id = this.props.route.item.id;
            this.fetchDataBanner(id);
            this.getColumnData(id);
        })
    }

    render() {
        const { navigator, route } = this.props;
        const { item } = route;
        const { isColumnListRender, isRender, BannerList, ColumnList } = this.state;
        return (
            <View style={styles.container}>
                <Appbar title={item.attr.aliasName || item.name} navigator={navigator} />
                <SmartBanner isRender={isRender} imgList={BannerList} navigator={navigator} />
                {
                    isColumnListRender ?
                    <SecColumnList data={ColumnList} navigator={navigator} />
                    :
                    <Loading />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }

});
