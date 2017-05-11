// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import VueMaterial from 'vue-material';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';


import 'vue-material/dist/vue-material.css'
import 'font-awesome/css/font-awesome.css'
import VueI18n from 'vue-i18n'
import messages from './ext/i18n.js'
// console.log("languagePack", languagePack);




Vue.config.productionTip = false
// 使用Vue Material
Vue.use(VueMaterial);

// 使用Muse UI
Vue.use(MuseUI);


// 高德地图
import AMap from 'vue-amap';
Vue.use(AMap);
AMap.initAMapApiLoader({
  key:'c90e324ed831b47f435bd3ae3dcfc68e',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','Geolocation']
});

/* eslint-disable no-new */
Vue.use(VueI18n);

// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'en', // set locale
  messages, // set locale messages
})
console.log("i18n", i18n);
new Vue({
  i18n: i18n,
  router,
  template: '<App/>',
  components: { App },
  
}).$mount("#app");
