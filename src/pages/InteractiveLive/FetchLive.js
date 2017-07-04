// 该数据将在index.js初始化，由接口确认实际服务器地址
// global.BASE_LIVE = 'http://10.9.212.101:8080/LivePortal/';

const API = {
    getBitRate: 'system/getBitRate',
    modRoom: 'room/modRoom',
    getColumnType: 'column/getColumnType',
    getColumnList: 'column/getColumnList',
    queryColumnUserInfoList: 'column/queryColumnUserInfoList',
    queryOnlineNum: 'user/queryOnlineNum',
    searchKeyWord: 'search/searchKeyWord',
    updateRoomColumn:'room/updateRoomColumn',
    changeLiveStatus:'user/changeLiveStatus',
    getPlayUrl:'live/getPlayUrl',
    getHistoryList: 'user/getHistoryList',
    getFocusList: 'user/getFocusList',
    deleteFocus: 'user/deleteFocus',
    enterRoom:'live/enterRoom',
    leaveRoom:'live/leaveRoom',
    addFocus:'user/addFocus',
    applyForHost:'host/applyForHost',
    modUser:'user/modUser'
}

const KEY = '&authKey=%21%40%23%24%25%5E%26*%28%29';
const COMMON = 'version=V001&terminalType=3';

export default function fetchLive(url, para, success){
    process(fetch(BASE_LIVE + API[url] + '?' +COMMON + objToPara(para) + KEY), success);
}

export function fetchPost(url, para, success){
    process(fetch(BASE_LIVE + API[url],{
        method: 'POST',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded'
        },
        body: COMMON + objToPara(para)
    }),success)
}

function process(request, success){
    request.then((response) => {
        if (response.ok) {
            return response.json();
        }
    })
    .then((data) => {
        success&&success(data);
    })
    .catch((err) => {
        console.warn(err);
    })
}

function objToPara(obj){
    if(obj){
        let paras = '';
        for(par in obj){
            if(obj[par]){
                paras += '&' + par + '=' + encodeURIComponent(obj[par]);
            }
        }
        return paras;
    }
    return '';
}
