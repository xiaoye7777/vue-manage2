import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import User from '../views/User.vue'
import Main from '../views/Main.vue'
import Mall from '../views/Mall.vue'
import PageOne from '../views/PageOne.vue'
import PageTwo from '../views/PageTwo.vue'
import Login from '../views/Login.vue'
import Cookie from 'js-cookie'

//下载vue-router插件，引入，use，然后就可以开始写了，
//要把组件也引入，才能写路径，规则都写在routes里面
//创建一个路由器实例router，把这些规则routes放进去
//把路由器router实例暴露出去，为了挂在根节点，main.js里new Vue里写个router。
//大功告成

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    component:Main,
    name: 'Main',
    redirect:'/home',//重定向
    children:[
      // { path:'home', name:'home', component:Home},
      // { path:'user', name:'user', component:User },
      // { path:'mall', name:'mall', component:Mall },
      // { path:'page1', name:'page1', component:PageOne },
      // { path:'page2', name:'page2', component:PageTwo }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

//全局前置路由守卫
router.beforeEach((to,from,next) => {
  //判断token存不存在
  const token = Cookie.get('token')
  if(!token && to.name !== 'login') {     //token不存在，并且目标不是登录页，就得强制跳去登录页
    next({ name: 'login' })
  } else if(token && to.name === 'login') {
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router