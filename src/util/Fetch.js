import Store from './LoginStore';
import XML from 'xmlbuilder';

global.Base = 'http://10.9.219.24:8080/';
global.portalId = '50001';
global.client = 'guizhou'
global.account = 'guizhou'

const API = {
    //获取一级栏目
    GetRootContents:() => XML.begin().ele('GetRootContents', {portalId:portalId, account:"long", client:"8757002164629739", languageCode:"Zh-CN", regionCode:"1", startAt:"1", profile:"1.0", maxItems:"10", serviceType:"MOD"}).end(),
    //获取推荐栏目(海报)/获取关联节目（targetLabel=R）
    GetAssociatedFolderContents:({quickId='',targetLabel='R',associatedType='1'}) => XML.begin().ele('GetAssociatedFolderContents', {quickId:quickId, targetLabel:targetLabel, startAt:"1", maxItems:"12", portalId:portalId, associatedType:associatedType, client:"8001002110042106", account:"8001002110042106", mergeTV:"1"}).end(),
    //获取媒资类型
    GetRetrieveContent:({folderAssetId='', retrieve='assetType'}) => XML.begin().ele('GetRetrieveContent', {portalId:portalId, client:"8001002110042106", account:"wxy00001",  retrieve:retrieve, folderAssetId:folderAssetId}).end(),
    //获取二级栏目信息（热门）/获取二级栏目列表(includeSelectableItem=true)/获取电视剧子栏目
    GetFolderContents:({assetId='',folderAssetId='',titleProviderId='',maxItems=6, includeSelectableItem='N'}) => XML.begin().ele('GetFolderContents', {folderAssetId:folderAssetId, titleProviderId:titleProviderId, assetId:assetId, portalId:portalId, account:"8001002110042106", client:"8001002110042106", includeSubFolder:"Y", includeSelectableItem:includeSelectableItem, mergeTV:"1", subIncludeSelectableItem:includeSelectableItem, startAt:"1", maxItems:maxItems}).end(),
    //获取媒资详情
    GetItemData:({titleAssetId=''}) => XML.begin().ele('GetItemData', {titleAssetId:titleAssetId, portalId:portalId, client:Store.userCode, account:Store.userCode}).end(),
    //获取播放串
    getPlayURL:({assetId='', resourceCode='', playType=1, shifttime=0, shiftend=0, delay=0, fmt=''}) => `{ "providerID":"10011",`+ (assetId?`"assetID":"${assetId}",`:``)+`"resourceCode":"${resourceCode}","version":"1.2.24", "userCode":"${Store.userCode}","userName":"${Store.userCode}","terminalType":"2","resolution":"1024*768","fmt":"${fmt}","playType":"${playType}","shifttime":"${shifttime}", "shiftend":"${shiftend}", "delay":"${delay}","deviceName": "iPad4,1","subID":"5046","productCode":"0000002"}`,
    //获取频道列表
    GetChannels:({channelType='',startAt=1,maxItems=200}) => XML.begin().ele('GetChannels', { portalId:portalId, client:client, account:account, customerGroup:"VIP", containPrograms:"Y", isAuth:"N", startAt:startAt, maxItems:maxItems, channelType:channelType}).end(),
    //获取节目单
    GetPrograms:({channelIds='',startDateTime=''}) => XML.begin().ele('GetPrograms', { portalId:portalId, client:client, account:account, startDateTime:startDateTime, channelIds:channelIds, serviceType:"ALL"}).end(),
    //搜索（类型、年份、地区）
    SearchAction:({keyword='',keywordType=3, startAt=1, maxItems=30,origin='', year='',genre=''}) => XML.begin().ele('SearchAction', {keyword:keyword, keywordType:keywordType, startAt:startAt, maxItems:maxItems, portalId:portalId, client:"8001002110042106", account:"8001002110042106", mergeTV:"1"}).ele('UserParams').ele('FilterBoxes',{serviceType:"VOD", genre:genre, year:year, origin:origin}).end(),
    //获取评论
    GetComments:({objID='',providerId='',startAt=1,maxItems=10,objType=2}) => XML.begin().ele('GetComments', { objType:objType, objID:objID,  providerId:providerId, startAt:startAt, maxItems:maxItems, }).end(),
    //添加评论
    UserComment:({objID='',providerId='',comment='',objType=2}) => XML.begin().ele('UserComment', { version:"1", userCode:Store.userCode, objType:objType, objID:objID,  providerId:providerId,  comment:comment, }).end(),
    //添加收藏
    AddBookmark:({titleAssetId=''}) => XML.begin().ele('AddBookmark', { titleAssetId:titleAssetId, custom:"VOD", portalId:portalId, client:Store.userCode, account:Store.userCode}).end(),
    //取消收藏
    DeleteBookmark:({titleAssetId=''}) => XML.begin().ele('DeleteBookmark', { titleAssetId:titleAssetId, custom:"VOD", portalId:portalId, client:Store.userCode, account:Store.userCode}).end(),
    //登录
    Login:({version='V001',terminalType='3',userType='1',userCode='',passWord=''}) => XML.begin().ele('Login', { version:"V001", userType:"1", terminalType:"3", userCode:userCode, passWord:passWord, }).end(),
    //注册
    Register:({version='V001',terminalType='3',userCode='',passWord=''}) => XML.begin().ele('Register', { version:"V001", terminalType:"3", userCode:userCode, passWord:passWord, }).end(),
    //修改用户信息
    ModUserInfo:({userCode='',nickName='',liveUserId='',liveUserCode='',liveToken='',logo='',oldPassWord='',newPassWord=''}) => XML.begin().ele('ModUserInfo', { userCode:userCode, nickName:nickName, logo:logo,nickName:nickName,liveUserId:liveUserId,liveUserCode:liveUserCode,liveToken:liveToken, oldPassWord:oldPassWord, newPassWord:newPassWord, }).end(),
    //获取预约列表
    GetProgramOrder:({maxItems=999, outOfDate=''}) => XML.begin().ele('GetProgramOrders', { userCode:Store.userCode, maxItems:maxItems, outOfDate:outOfDate}).end(),
    //删除预约
    DelProgramOrder:({orderId=''}) => XML.begin().ele('DelProgramOrder', { userCode:Store.userCode, orderId:orderId}).end(),
    //预约
    AddProgramOrder:({programId=''}) => XML.begin().ele('AddProgramOrder', { userCode:Store.userCode, programId:programId}).end(),
    //获取观看历史
    GetHistorys:({maxItems=999,startAt=1}) => XML.begin().ele('GetHistorys', { startAt:startAt, maxItems:maxItems, portalId:portalId, client:Store.userInfo.userCode, account:Store.userInfo.userCode}).end(),
    //删除历史记录
    DeleteHistorys:({historyId=''}) => XML.begin().ele('DeleteHistorys', { historyId:historyId, portalId:portalId, client:Store.userCode, account:Store.userCode}).end(),
    //获取收藏
    GetBookmarks:({maxItems=999,startAt=1}) => XML.begin().ele('GetBookmarks', { startAt:startAt, maxItems:maxItems, portalId:portalId, client:Store.userInfo.userCode, account:Store.userInfo.userCode}).end(),
    //热词
    GetSearchHotKeywords:({maxItems=10,startTime='20131023000000'}) => XML.begin().ele('GetSearchHotKeywords', { client:"8757002164629739", account:"long", portalId:portalId, serviceType:"VOD", showType :"All", startTime:startTime, startAt:"1", maxItems:maxItems, profile:"1.0"}).end(),
    //服务器配置
    GetParam:() => '',
}


export default function fetchData(url,{headers={'Content-Type': 'application/xml'},par = {} } = {},success){
    const _body = API[url](par);
    return fetch(`${Base+url}?dataType=JSON`, {
        method: 'POST',
        headers: headers,
        body: _body
    })
    .then((response) => {
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

module.exports = fetchData;
