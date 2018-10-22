import Vue from 'vue'
import Router from 'vue-router'
// 引入Home组件
import Home from 'pages/Home'
// 引入Login组件
import Login from 'pages/Login'
// 引入Register组件
import Register from 'pages/Register'
// 引入Error404组件
import Error404 from 'pages/404'

// 让路由规则生效
Vue.use(Router)
// 暴露了一个路由对象
export default new Router({
  // 去掉访问的时候的/#这个动态参数
    mode: 'history',
    // 路由规则
    routes: [
      {
        path: '/',
        name: 'Home',
        component: Home // 如果用户访问的是首页的话，那么我就让它加载Home组件
      },
      {
        path: '/Login',
        name: 'Login',
        component: Login // 如果用户访问的是首页的话，那么我就让它加载Login组件
      },
      {
        path: '/Register',
        name: 'Register',
        component: Register // 如果用户访问的是首页的话，那么我就让它加载Register组件
      },
      {
        path: '*',
        name: 'Error404',
        component: Error404 // 如果用户访问的是首页的话，那么我就让它加载Error404组件
      },
    ]
})
