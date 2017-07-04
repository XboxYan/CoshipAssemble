import { observable,action,computed} from 'mobx';
class LoginStore {
    @observable
    loginState=false;

    @observable
    userInfo=null;

    @action
    setState = (loginState) => {
        this.loginState = loginState
    }

    @action
    setUserInfo = (userInfo) => {
        this.userInfo = userInfo
    }

    @computed get userCode(){
        return this.userInfo ? this.userInfo.userCode : '';
    }

    @computed get needLogin(){
        return this.userInfo == null;
    }

    @computed get isAnchor(){
        return this.userInfo&&this.userInfo.liveUserInfo&&this.userInfo.liveUserInfo.isLive>0;
    }

    @computed get liveUserCode(){
        return this.userInfo&&this.userInfo.liveUserInfo ? this.userInfo.liveUserInfo.userCode : '';
    }

    @computed get liveUserId(){
        return this.userInfo&&this.userInfo.liveUserInfo ? this.userInfo.liveUserInfo.userId : '';
    }

    @computed get liveToken(){
        return this.userInfo&&this.userInfo.liveUserInfo ? this.userInfo.liveUserInfo.token : '';
    }
}

let Store = new LoginStore();
module.exports = Store;
