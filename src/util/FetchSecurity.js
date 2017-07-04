// const Base = "http://10.9.216.1:8887/";
const API = {
    GetContents: () => `<GetContents client="8757002164629739" terminalType="ATV" startAt="1" maxItems="50"/>`,
    HTTPLive: ({deviceId}) => `<HTTPLive client="8757002164629739" deviceId="${deviceId}" terminalType="ATV"/>`,
    AddAlarmMessage:({alarmManName,phoneNumber,alarmType,alarmMessage,alarmAddress,deviceId})=>`<AddAlarmMessage client="8757002164629739" terminalType="ATV" alarmManName="${alarmManName}" phoneNumber="${phoneNumber}" alarmMessage="${alarmMessage}" alarmAddress="${alarmAddress}"  alarmType="${alarmType}"   deviceId="${deviceId}"/>`,
    HTTPPlayback:({deviceId,startDateTime,endDateTime})=>`<HTTPPlayback client="8757002164629739" deviceId="${deviceId}" startDateTime="${startDateTime}" endDateTime="${endDateTime}" terminalType="ATV"/>`
}

export default function fetchSecurity(url, {headers = {'Content-Type': 'application/xml'}, par = {}} = {}, success) {
    const _body = API[url](par);
    fetch(`${BASE_SECURITY + url}?dataType=JSON`, {
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
            success && success(data);
        })
        .catch((err) => {
            console.warn(err);
        })
}

module.exports=fetchSecurity
