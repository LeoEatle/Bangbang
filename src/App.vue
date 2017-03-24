<template>
  <div id="app">
        <md-toolbar>
            <md-button class="md-icon-button" @click.native="toggleLeftSidenav">
                <md-icon>menu</md-icon>
            </md-button>
            <router-link to="/"><h2 class="md-title" style="flex: 1">Bangbang</h2></router-link>
        </md-toolbar>
        <Sidenav ref="leftSidenav" @open="open('left')" @close="close('left')"></Sidenav>

      <router-view></router-view>
  </div>
</template>

<script>
import home from './views/Home.vue';
import createActivity from './views/CreateActivity.vue';
import Sidenav from './components/Sidenav.vue';
export default {
  name: 'app',
  methods: {
    toggleLeftSidenav() {
        this.$refs.leftSidenav.toggleSidenav();
    },
    open(ref) {
        console.log('Opened: '+ ref);
    },
    close(ref) {
        console.log('Closed: '+ ref);
    },
  },
  components: {
    home,
    createActivity,
    Sidenav
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
