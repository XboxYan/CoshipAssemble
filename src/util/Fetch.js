global.Base = 'http://10.9.216.2:8080/';

global.portalId = 51001;

const API = {
    //获取一级栏目
    GetRootContents:() => `<GetRootContents portalId="${portalId}" account="long" client="8757002164629739" languageCode="Zh-CN" regionCode="1" startAt="1" profile="1.0" maxItems="10" serviceType="MOD"/>`,
    //获取推荐栏目(海报)/获取关联节目（targetLabel=R）
    GetAssociatedFolderContents:({quickId='',targetLabel='R',associatedType='1'}) => `<GetAssociatedFolderContents quickId="${quickId}" targetLabel="${targetLabel}" startAt="1" maxItems="12" portalId="${portalId}" associatedType="${associatedType}" client="8001002110042106" account="8001002110042106" mergeTV="1"/>`,
    //获取媒资类型
    GetRetrieveContent:({folderAssetId=''}) => `<GetRetrieveContent portalId="51001" client="8001002110042106" account="wxy00001"  retrieve="assetType" folderAssetId="${folderAssetId}"/>`,
    //获取二级栏目信息（热门）/获取二级栏目列表(includeSelectableItem=true)
    GetFolderContents:({assetId='',includeSelectableItem='N'}) => `<GetFolderContents assetId="${assetId}" portalId="${portalId}" account="8001002110042106" client="8001002110042106" includeSubFolder="Y" includeSelectableItem="${includeSelectableItem}" mergeTV="1" subIncludeSelectableItem="${includeSelectableItem}" startAt="1" maxItems="20" />`,
    //获取媒资详情
    GetItemData:({titleAssetId=''}) => `<GetItemData titleAssetId="${titleAssetId}" portalId="${portalId}" client="8001002110042106" account="8001002110042106"/>`,
    //获取播放串
    getPlayURL:({assetId=''}) => `{ "providerID":"10011","assetID":"${assetId}", "version":"1.2.24", "userCode":"aa","userName":"aa","terminalType":"2","resolution":"1024*768","fmt":"1","playType":"1","deviceName": "iPad4,1","subID":"5046","productCode":"0000002"}`,
}

const fetchData = (url,{headers={'Content-Type': 'application/xml'},par = {} } = {},success) => {
    const _body = API[url](par);
    fetch(`${Base+url}?dataType=JSON`, {
        method: 'POST',
        headers: headers,
        body: _body
    })
    .then((response) => {
        if (response.ok) {
            return response.json()
        }
    })
    .then((data) => {
        success&&success(data);
    })
    .catch((err) => {
        alert(err)
    })
}

module.exports = fetchData;