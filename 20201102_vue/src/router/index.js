import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Register from '../components/Register'
import Home from '../components/Home'
import ForgerPwd from '../components/ForgetPwd'
import Welcome from '../components/home/Welcome'
import SearchStore from '../components/home/staff/store_manage/SearchStore'
import OrderInfo from '../components/home/staff/store_manage/OrderInfo'
import BookEnter from '../components/home/staff/store_manage/BookEnter'
import NoticeInfo from '../components/home/staff/issue_notice/NoticeInfo'

Vue.use(Router)

const router = new Router({ 
  //去除默认的#
  mode:'history',
  routes:[
    {path:'/',redirect:'/login'},
    {path:'/login', component:Login},
    {path:'/register', component:Register},
    {
      path:'/home', 
      component: Home,
      redirect:'/welcome',
      children:[
        {path:'/', redirect:'/welcome'},
        {path:'/welcome', component:Welcome},
        {path:'/storeManage/searchStore', component:SearchStore},
        {path:'/storeManage/orderInfo',component:OrderInfo},
        {path:'/storeManage/bookEnter',component:BookEnter},
        {path:'/issueNotice/noticeInfo',component:NoticeInfo}
      ]
    },
    {path:'/forgetPwd', component: ForgerPwd}
  ]
})

//挂在路由导航守卫
router.beforeEach((to,from,next) => {
  if (to.path == '/login' || to.path == '/register' || to.path == '/forgetPwd') {
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
