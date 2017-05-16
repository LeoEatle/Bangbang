<template>
  <div id="app">
        <md-toolbar>
            <md-button class="md-icon-button" @click.native="toggleLeftSidenav">
                <md-icon>menu</md-icon>
            </md-button>
            <router-link to="/"><h2 class="md-title" style="flex: 1">Bangbang</h2></router-link>
        </md-toolbar>
        <Sidenav :state="close" ref="leftSidenav" @open="open('left')" @close="close('left')"></Sidenav>
        <md-dialog-confirm
          :md-title="confirm.title"
          :md-content-html="confirm.contentHtml"
          :md-ok-text="confirm.ok"
          :md-cancel-text="confirm.cancel"
          @open="onOpen"
          @close="onClose"
          ref="dialog5">
        </md-dialog-confirm>
      <router-view></router-view>
  </div>
</template>

<script>
import home from './views/Home.vue';
import createActivity from './views/CreateActivity.vue';
import Sidenav from './components/Sidenav.vue';
import Register from './views/Register.vue';
import AVTools from './ext/AVTools';
export default {
  name: 'app',
  
  methods: {
    beforeCreate() {
     
 
    },
    askSign() {
      console.log("提示用户登录！");
      this.$refs.dialog5.open();
    },
    changeLanguage(value) {
      console.log(value);
      console.log(this.$i18n);
    },
    toggleLeftSidenav() {
        this.$data.state = !this.$data.state;
        this.$refs.leftSidenav.toggleSidenav();
    },
    open(ref) {
        console.log('Opened: '+ ref);
    },
    close(ref) {
        console.log('Closed: '+ ref);
    },
    openDialog(ref) {
      this.$refs[ref].open();
    },
    closeDialog(ref) {
      this.$refs[ref].close();
    },
    onOpen() {
      console.log('你给我去登录/注册！');
    },
    onClose(type) {
      if (type === 'ok'){
        console.log("用户选择了妥协");
        this.$router.push({
          path: 'register'
        });
        this.$refs.leftSidenav.$refs.sidenav.close();      
      }
      else if (type === 'cancel'){
        console.log("用户说还想再逛逛");
        this.$refs.leftSidenav.$refs.sidenav.close();      
      }
    }
  },
  created(){
    this.$on('ask-sign', function(action){
      console.log('askSign listened!');
      this.$refs.dialog5.open();
    });
    this.$on('change-language', function(lang){
      console.log('Change language!', lang);
      console.log(this.$i18n);
      if (lang == "English"){
        this.$i18n.locale = 'en';
      }else if (lang == "Chinese"){
        this.$i18n.locale = 'zh';
      }
    })

    AVTools.AVInit();
    
  },
  components: {
    home,
    createActivity,
    Sidenav
  },
  data: function(){
    return {
      confirm: {
            title: "Ops! 您还没有登录呢？",
            contentHtml: "请点击“去登录/注册”按钮进行登录/注册操作",
            ok: "去登录/注册",
            cancel: "再继续逛逛"
      },
      state: false
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.md-title {
  text-align: left;
  color: #ffffff;
}
</style>
