import Store from './LoginStore';

global.Base = 'http://10.9.216.2:8080/';

global.portalId = 50001;
global.client = 'guizhou'
global.account = 'guizhou'

const API = {
    //获取一级栏目
    GetRootContents:() => `<GetRootContents portalId="${portalId}" account="long" client="8757002164629739" languageCode="Zh-CN" regionCode="1" startAt="1" profile="1.0" maxItems="10" serviceType="MOD"/>`,
    //获取推荐栏目(海报)/获取关联节目（targetLabel=R）
    GetAssociatedFolderContents:({quickId='',targetLabel='R',associatedType='1'}) => `<GetAssociatedFolderContents quickId="${quickId}" targetLabel="${targetLabel}" startAt="1" maxItems="12" portalId="${portalId}" associatedType="${associatedType}" client="8001002110042106" account="8001002110042106" mergeTV="1"/>`,
    //获取媒资类型
    GetRetrieveContent:({folderAssetId='', retrieve='assetType'}) => `<GetRetrieveContent portalId="${portalId}" client="8001002110042106" account="wxy00001"  retrieve="${retrieve}" folderAssetId="${folderAssetId}"/>`,
    //获取二级栏目信息（热门）/获取二级栏目列表(includeSelectableItem=true)/获取电视剧子栏目
    GetFolderContents:({assetId='',folderAssetId='',titleProviderId='',maxItems=6, includeSelectableItem='N'}) => `<GetFolderContents folderAssetId="${folderAssetId}" titleProviderId="${titleProviderId}" assetId="${assetId}" portalId="${portalId}" account="8001002110042106" client="8001002110042106" includeSubFolder="Y" includeSelectableItem="${includeSelectableItem}" mergeTV="1" subIncludeSelectableItem="${includeSelectableItem}" startAt="1" maxItems="${maxItems}" />`,
    //GetFolderContents:({assetId='',maxItems=6, includeSelectableItem='N'}) => `<GetFolderContents assetId="${assetId}" portalId="${portalId}" account="8001002110042106" client="8001002110042106" includeSubFolder="Y" includeSelectableItem="${includeSelectableItem}" mergeTV="1" subIncludeSelectableItem="${includeSelectableItem}" startAt="1" maxItems="${maxItems}" />`,
    //获取媒资详情
    GetItemData:({titleAssetId=''}) => `<GetItemData titleAssetId="${titleAssetId}" portalId="${portalId}" client="8001002110042106" account="8001002110042106"/>`,
    //获取播放串
    getPlayURL:({assetId='', resourceCode='', playType=1, shiftTime=0, endTime=0, delay=0}) => `{ "providerID":"10011","assetID":"${assetId}","resourceCode":"${resourceCode}","version":"1.2.24", "userCode":"${Store.userCode}","userName":"${Store.userCode}","terminalType":"2","resolution":"1024*768","fmt":"1","playType":"${playType}","shiftTime":"${shiftTime}", "endTime":"${endTime}", "delay":"${delay}","deviceName": "iPad4,1","subID":"5046","productCode":"0000002"}`,
    //获取频道列表
    GetChannels:({channelType,startAt=1,maxItems=200}) => `<GetChannels portalId="${portalId}" client="${client}" account="${account}" customerGroup="VIP" containPrograms="Y" isAuth="N" startAt="${startAt}" maxItems="${maxItems}" channelType="${channelType}"/>`,
    //获取节目单
    GetPrograms:({channelIds,startDateTime=''}) => `<GetPrograms portalId="${portalId}" client="${client}" account="${account}" startDateTime="${startDateTime}" channelIds="${channelIds}" serviceType="ALL"/>`,
    //获取回看或者时移节目单
    ChannelSelectionStart:({channelId, startDateTime, endDateTime}) => `<ChannelSelectionStart portalId="${portalId}" client="${client}" account="${account}" channelId="102400012" startDateTime="${startDateTime}" endDateTime="${endDateTime}"/>`,
    //搜索（类型、年份、地区）
    SearchAction:({keyword='', startAt=1, maxItems=30,origin='', year='',genre=''}) => `<SearchAction keyword="${keyword}" startAt="${startAt}" maxItems="${maxItems}" portalId="1" client="8001002110042106" account="8001002110042106" mergeTV="1"><UserParams><FilterBoxes serviceType="VOD" genre="${genre}" year="${year}" origin="${origin}" ></FilterBoxes></UserParams></SearchAction>`,
    //获取评论
    GetComments:({objID='',providerId='',startAt=1,maxItems=10}) => `<GetComments objType="2" objID="${objID}"  providerId="${providerId}" startAt="${startAt}" maxItems="${maxItems}" />`,
    //添加评论
    UserComment:({objID='',providerId='',comment=''}) => `<UserComment version="1" userCode="${Store.userCode}" objType="2" objID="${objID}"  providerId="${providerId}"  comment="${comment}" />`,
    //登录
    Login:({version='V001',terminalType='3',userType='1',userCode,passWord}) => `<Login version="V001" userType="1" terminalType="3" userCode="${userCode}" passWord="${passWord}" />`,
    //注册
    Register:({version='V001',terminalType='3',userCode,passWord}) => `<Register version="V001" terminalType="3" userCode="${userCode}" passWord="${passWord}" />`,
    //修改用户信息
    ModUserInfo:({userCode='',nickName='',logo='',oldPassWord='',newPassWord=''}) => `<ModUserInfo userCode="${userCode}" nickName="${nickName}" logo="${logo}" oldPassWord="${oldPassWord}" newPassWord="${newPassWord}" />`,
    //获取预约列表
    GetProgramOrder:({maxItems=999, outOfDate='0'}) => `<GetProgramOrders userCode="${Store.userCode}" maxItems="${maxItems}" outOfDate="${outOfDate}"/>`,
    //删除预约
    DelProgramOrder:({orderId}) => `<DelProgramOrder userCode="${Store.userCode}" orderId="${orderId}"/>`,
    //预约
    AddProgramOrder:({programId}) => `<AddProgramOrder userCode="${Store.userCode}" programId="${programId}"/> `,
}

export default function fetchData(url,{headers={'Content-Type': 'application/xml'},par = {} } = {},success){
    const _body = API[url](par);
    fetch(`${Base+url}?dataType=JSON`, {
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
