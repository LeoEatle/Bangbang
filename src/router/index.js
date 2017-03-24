import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import createActivity from '@/views/CreateActivity'
import personalCenter from '@/views/PersonalCenter'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/create-activity',
      name: 'createActivity',
      component: createActivity
    },
    {
      path: '/personal-center',
      name: 'personalCenter',
      component: personalCenter,
    }
  ]
})
