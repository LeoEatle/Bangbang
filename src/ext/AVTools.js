import AV from 'leancloud-storage';

const APP_ID = 'qYGgpyPNXvtow5qSDbBrcvP3-gzGzoHsz';
const APP_KEY = 'dfuv5m2kEn7sYelmm9tEKDpD';

export default {
    // Leancloud初始化
    AVInit(){
        AV.init({ appId:APP_ID, appKey:APP_KEY });
        console.log("AV Inited");
    },
    // 返回目前登陆的用户
    AVCurrentUser() {
        return AV.User.current();
    }
}