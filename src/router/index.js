import Vue from 'vue'
import Router from 'vue-router'
// 引入store
import store from '@/store'

// 这种是默认的加载组件的方式，所有的组件都会被扔到app.js这个文件里面，当组件过多的时候，app.js这个文件就会非常的大
// // 引入Home组件
// import Home from 'pages/Home'
// // 引入Login组件
// import Login from 'pages/Login'
// // 引入Register组件
// import Register from 'pages/Register'
// // 引入Error404组件
// import Error404 from 'pages/404'

// 所以呢，推荐使用reqiure.ensure路由懒加载
// const Home = resolve => {
//     require.ensure(['pages/Home.vue'],() => {
//         resolve(require('pages/Home.vue'))
//     })
// }

// const Login = resolve => {
//     require.ensure(['pages/Login.vue'], () => {
//         resolve(require('pages/Login.vue'))
//     })
// }

// const Register = resolve => {
//     require.ensure(['pages/Register.vue'], () => {
//         resolve(require('pages/Register.vue'))
//     })
// }

// const Error404 = resolve => {
//     require.ensure(['pages/404.vue'], () => {
//         resolve(require('pages/404.vue'))
//     })
// }

// 让路由规则生效
Vue.use(Router)

const router = new Router({
  // 去掉访问的时候的/#这个动态参数
  mode: 'history',
  // 路由规则
  routes: [
    {
      path: '/',
      name: 'Home',
      // 路由的懒加载 这种加载方式会在浏览器访问某个页面的时候加载某个页面，不会一次性加载完毕，极大的节省了资源，避免了资源的浪费，减少了页面的加载速度
      component: () => import('pages/Home'), // 如果用户访问的是首页的话，那么我就让它加载Home组件
      // 在需要权限的页面路由中,添加一个requireAuth字段,写在meta里面
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('pages/Login') // 如果用户访问的是首页的话，那么我就让它加载Login组件
    },
    {
      path: '/Register',
      name: 'Register',
      component: () => import('pages/Register') // 如果用户访问的是首页的话，那么我就让它加载Register组件
    },
    {
      path: '*',
      name: 'Error404',
      component: () => import('pages/404') // 如果用户访问的是首页的话，那么我就让它加载Error404组件
    },
  ]
})
// 路由在跳转的时候都会先执行这个代码
router.beforeEach((to, from, next) => {
  // 获取token
  let token = store.state.token
  if(to.meta.requireAuth) {
    // 是否需要权限的页面
    if(token) {
      next() // token存在,则让他通过
    }else {
      // token不存在,不让他通过,跳转到登陆页面
      next({
        path: '/login'
      })
    }
  }else {
    // 不需要权限的页面
    next() // 往下走路由就行了
  }
})

// 暴露了一个路由对象
export default router




