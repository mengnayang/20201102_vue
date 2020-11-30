import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Register from '../components/Register'
import Home from '../components/Home'
import ForgerPwd from '../components/ForgetPwd'
import Welcome from '../components/home/Welcome'
import UserList from '../components/home/administer/user_manage/UserList'
import RoleList from '../components/home/administer/access_manage/RoleList'
import SearchStore from '../components/home/storeManger/store_info/SearchStore'
import ReplenishmentApplication from '../components/home/storeManger/store_info/ReplenishmentApplication'
import OrderInformation from '../components/home/storeManger/store_info/OrderInformation'
import PurchaseList from '../components/home/storeManger/out_in_info/PurchaseList'
import WholeSaleDeliveryList from '../components/home/storeManger/out_in_info/WholeSaleDeliveryList'
import RetailDeliveryList from '../components/home/storeManger/out_in_info/RetailDeliveryList'
import StockTaking from '../components/home/storeManger/store_record/StockTaking'
import ViewStockTakingRules from '../components/home/storeManger/store_record/ViewStockTakingRules'
import OrderInfo from '../components/home/manage/store_manage/OrderInfo'
import BookEnter from '../components/home/manage/store_manage/BookEnter'
import NoticeInfo from '../components/home/manage/issue_notice/NoticeInfo'

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
        {path:'/stafflist', component:UserList},
        {path:'/stafflistjurisdiction', component: RoleList},
        {path:'/showinventory', component:SearchStore},
        {path:'/replenishmentapplication', component:ReplenishmentApplication},
        {path:'/orderInformation', component:OrderInformation},
        {path:'/purchaselist', component:PurchaseList},
        {path:'/wholesaledeliverylist', component:WholeSaleDeliveryList},
        {path:'/retaildeliverylist', component:RetailDeliveryList},
        {path:'/stocktaking', component: StockTaking},
        {path:'/stocktaking/viewStocktakingRules', component:ViewStockTakingRules},
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
  const staffToken = window.sessionStorage.getItem('staffToken')
  if (!staffToken) {
    return next('/login')
  } else {
    next()
  }
})

export default router
