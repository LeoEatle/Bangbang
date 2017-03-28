<template>
  <div id="app">
        <md-toolbar>
            <md-button class="md-icon-button" @click.native="toggleLeftSidenav">
                <md-icon>menu</md-icon>
            </md-button>
            <router-link to="/"><h2 class="md-title" style="flex: 1">Bangbang</h2></router-link>
        </md-toolbar>
        <Sidenav ref="leftSidenav" @open="open('left')" @close="close('left')"></Sidenav>
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
// import AV from 'leancloud-storage';
export default {
  name: 'app',
  created(){
        this.$AVInit();
        console.log("AVExsited", AV);
  },
  methods: {
    beforeCreate() {
     
 
    },
    toggleLeftSidenav() {
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
      console.log('go to sign in!');
      this.$route.push({
        path: 'register'
      })
    },
    onClose(type) {
      console.log('Closed', type);
    }
  },
  created(){
    this.$on('askSign', ()=>{
      console.log('askSign listened!');
      this.$refs.dialog5.open();
    });
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
      }
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
