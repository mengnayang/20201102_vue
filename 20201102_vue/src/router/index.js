import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Register from '../components/Register'
import Home from '../components/Home'

Vue.use(Router)

const router = new Router({ 
  //去除默认的#
  mode:'history',
  routes:[
    {path:'/',redirect:'/login'},
    {path:'/login', component:Login},
    {path:'/register', component:Register},
    {path:'/home', component: Home}
  ]
})

//挂在路由导航守卫
router.beforeEach((to,from,next) => {
  if (to.path == '/login' || to.path == '/register') {
    return next()
  } 
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    return next('/login')
  } else {
    next()
  }
})

export default router
