import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import createActivity from '@/views/CreateActivity_mu'
import personalCenter from '@/views/PersonalCenter'
import Register from '@/views/Register'
import activityDetail from '@/views/ActivityDetail';
import joinedActivity from '@/views/JoinedActivity';
import Setting from '@/views/Setting';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/activity_detail/:id',
      name: "activity_detail",
      component: activityDetail,
      props: true
    },
    {
      path: '/create-activity',
      name: 'createActivity',
      component: createActivity
    },
    {
      path: '/personal-center/:id',
      name: 'personalCenter',
      component: personalCenter,
      // 将路由的参数作为props传入组件
      props: true
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/joined_activity',
      name: 'joinedActivity',
      component: joinedActivity
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting
    }
  ]
})
