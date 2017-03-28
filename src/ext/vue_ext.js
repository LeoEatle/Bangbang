var myPlugin = {
    name: "LeanCloud"
};
myPlugin.install = function install (Vue) {
    function AVInit(){
        var APP_ID = 'qYGgpyPNXvtow5qSDbBrcvP3-gzGzoHsz';
        var APP_KEY = 'dfuv5m2kEn7sYelmm9tEKDpD';
        AV.init({ appId:APP_ID, appKey:APP_KEY });
        console.log("Plugin installed");
    }

    Object.defineProperties(vue.prototype, {
        $AVInit: {
            get() {
                return AVInit;
            }
        }
    })
}

export default myPlugin;